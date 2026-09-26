import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import { freezerStatus } from '$lib/config/freezer.options'
import { deploymentStatus } from '$lib/config/deployment.status'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, desc, isNull } from 'drizzle-orm'

const schema = z.object({
    freezerIds: z.array(z.string().nonempty()).nonempty(),
    designationId: z.string().nonempty(),
    deploymentDate: z.coerce.date()
})

const AVAILABLE_STATUSES = new Set<string>([freezerStatus.HOUSED_AVAILABLE, freezerStatus.PULLOUT])

export const POST = async ({ request, locals }) => {
    try {
        const account = locals.account!
        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            return json(
                { message: errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const { freezerIds, designationId, deploymentDate } = validation.data

        const root = await db.query.account.findFirst({
            where: eq(t.account.id, account.id),
            columns: { id: true },
            with: {
                childAccounts: {
                    columns: { id: true },
                    with: {
                        childAccounts: {
                            columns: { id: true }
                        }
                    }
                }
            }
        })

        const descendantIds = new Set(
            (root?.childAccounts ?? []).flatMap((child) => [
                child.id,
                ...(child.childAccounts ?? []).map((grand) => grand.id)
            ])
        )

        if (!descendantIds.has(designationId)) {
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
        }

        const result = await db.transaction(async (txn) => {
            const [parent] = await txn
                .insert(t.deployment)
                .values({
                    originId: account.id,
                    designationId,
                     status: deploymentStatus.TO_BE_DELIVERED,
                    deploymentDate
                })
                .returning()

            if (!parent) {
                error(StatusCodes.INTERNAL_SERVER_ERROR, errors.INTERNAL_ERROR)
            }

            const items: (typeof t.deploymentItem.$inferSelect)[] = []

            for (const freezerId of _.uniq(freezerIds)) {
                const [freezer] = await txn
                    .select()
                    .from(t.freezer)
                    .where(
                        and(
                            eq(t.freezer.id, freezerId),
                            eq(t.freezer.distributorId, account.id),
                            isNull(t.freezer.deletedAt)
                        )
                    )
                    .limit(1)

                if (!freezer) continue

                const [lastItem] = await txn
                    .select()
                    .from(t.deploymentItem)
                    .where(
                        and(
                            eq(t.deploymentItem.freezerId, freezer.id),
                            isNull(t.deploymentItem.deletedAt)
                        )
                    )
                    .orderBy(desc(t.deploymentItem.createdAt))
                    .limit(1)

                const eligible =
                    lastItem === undefined ||
                    (AVAILABLE_STATUSES.has(lastItem.status) &&
                        lastItem.designationId === account.id)

                if (!eligible) continue

                const [item] = await txn
                    .insert(t.deploymentItem)
                    .values({
                        deploymentId: parent.id,
                        designationId,
                        freezerId: freezer.id,
                        status: freezerStatus.FOR_DEPLOYMENT
                    })
                    .returning()

                items.push(item)
            }

            return { parent, items }
        })

        return json({
            data: {
                deployment: result.parent,
                items: result.items,
                count: result.items.length
            }
        })
    } catch (e: any) {
        if (isHttpError(e)) throw e

        const code = _.get(e, 'cause.code', null)

        switch (code) {
            case '23503':
                error(StatusCodes.UNPROCESSABLE_ENTITY, errors.FOREIGN_KEY_VIOLATION)
                break

            default:
                error(StatusCodes.INTERNAL_SERVER_ERROR, {
                    ...errors.INTERNAL_ERROR,
                    message: e.message ?? errors.INTERNAL_ERROR.message
                })
                break
        }
    }
}
