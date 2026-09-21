import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and } from 'drizzle-orm'

const schema = z.object({
    itemId: z.string().nonempty()
})

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

        const { itemId } = validation.data

        const result = await db.transaction(async (txn) => {
            const [item] = await txn
                .select()
                .from(t.deploymentItem)
                .where(eq(t.deploymentItem.id, itemId))
                .limit(1)

            if (!item) {
                error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
            }

            const [deployment] = await txn
                .select()
                .from(t.deployment)
                .where(
                    and(
                        eq(t.deployment.id, item.deploymentId),
                        eq(t.deployment.originId, account.id)
                    )
                )
                .limit(1)

            if (!deployment) {
                error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
            }

            const [deletedItem] = await txn
                .delete(t.deploymentItem)
                .where(eq(t.deploymentItem.id, itemId))
                .returning()

            if (!deletedItem) {
                error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
            }

            const [remaining] = await txn
                .select({ id: t.deploymentItem.id })
                .from(t.deploymentItem)
                .where(eq(t.deploymentItem.deploymentId, item.deploymentId))
                .limit(1)

            let parentDeleted = false

            if (!remaining) {
                const [removedParent] = await txn
                    .delete(t.deployment)
                    .where(eq(t.deployment.id, item.deploymentId))
                    .returning()

                parentDeleted = !!removedParent
            }

            return { item: deletedItem, parentDeleted }
        })

        return json({
            data: {
                deleted: true,
                itemId: result.item.id,
                parentDeleted: result.parentDeleted
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
