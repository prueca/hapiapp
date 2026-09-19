import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import { freezerStatus } from '$lib/config/freezer.options'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, desc } from 'drizzle-orm'

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
        const status = freezerStatus.FOR_DEPLOYMENT

        const [designation] = await db
             .select()
             .from(t.account)
             .where(
                  and(
                    eq(t.account.id, designationId),
                   eq(t.account.parentId, account.id)
             )
         )
             .limit(1)

        if (!designation) {
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
        }

        const result = await db.transaction(async (txn) => {
            const inserted: (typeof t.deployment.$inferSelect)[] = []

            for (const freezerId of _.uniq(freezerIds)) {
                const [freezer] = await txn
                     .select()
                     .from(t.freezer)
                     .where(
                          and(
                        eq(t.freezer.id, freezerId),
                        eq(t.freezer.distributorId, account.id)
                    )
              )
                     .limit(1)

                if (!freezer) continue

                const [lastDeployment] = await txn
                    .select()
                    .from(t.deployment)
                    .where(eq(t.deployment.freezerId, freezer.id))
                    .orderBy(desc(t.deployment.createdAt))
                    .limit(1)

                const lastStatus = lastDeployment?.status ?? null
                const eligible = lastStatus === null || AVAILABLE_STATUSES.has(lastStatus)

                if (!eligible) continue

                const [row] = await txn
                    .insert(t.deployment)
                    .values({
                        originId: account.id,
                        designationId,
                        freezerId: freezer.id,
                        status,
                        deploymentDate
                    })
                    .returning()

                inserted.push(row)
            }

            return inserted
        })

        return json({ data: { deployments: result, count: result.length } })
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
