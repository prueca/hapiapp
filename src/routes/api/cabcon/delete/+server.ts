import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, isNull } from 'drizzle-orm'

const schema = z.object({
    id: z.string().nonempty()
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

        const { id } = validation.data

        const [cabcon] = await db
             .select()
             .from(t.cabcon)
            .where(
                and(
                    eq(t.cabcon.id, id),
                    eq(t.cabcon.authorId, account.id),
                    isNull(t.cabcon.deletedAt)
                )
            )
            .limit(1)

        if (!cabcon) {
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
        }

        await db.transaction(async (txn) => {
            await txn.delete(t.cabconItem).where(eq(t.cabconItem.cabconId, id))
            await txn
                .update(t.cabcon)
                .set({ deletedAt: new Date(), updatedAt: new Date() })
                .where(eq(t.cabcon.id, id))
        })

        return json({ data: { deleted: true, id } })
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
