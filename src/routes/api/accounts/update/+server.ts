import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z, { ZodObject } from 'zod'
import accountTypes from '$lib/config/account.types'
import errors from '$lib/errors'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq, and, isNull } from 'drizzle-orm'
import * as t from '$lib/drizzle/schema'

const schema: ZodObject = z.object({
    id: z.ulid(),
    type: z.enum([accountTypes.DEALER, accountTypes.HAPISTORE]),
    name: z.string().nonempty(),
    address: z.string().nonempty(),
    phone: z.string().nonempty(),
    isrCode: z.string().nonempty().nullable(),
    sapCode: z.string().nonempty().nullable()
})

export const POST = async ({ request }) => {
    try {
        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            error(StatusCodes.BAD_REQUEST, errors.INVALID_DATA_FORMAT)
        }

        const { id } = validation.data
        const [account] = await db
            .update(t.account)
            .set(_.assign(_.omit(validation.data, 'id'), { updatedAt: new Date() }))
            .where(and(eq(t.account.id, id as string), isNull(t.account.deletedAt)))
            .returning()

        if (!account) {
            error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
        }

        return json({ data: account })
    } catch (e: any) {
        if (isHttpError(e)) throw e

        const code = _.get(e, 'cause.code', null)

        switch (code) {
            case '23505':
                error(StatusCodes.CONFLICT, errors.DATA_CONFLICT)

            case '23503':
                error(StatusCodes.UNPROCESSABLE_ENTITY, errors.FOREIGN_KEY_VIOLATION)

            case '23502':
                error(StatusCodes.BAD_REQUEST, errors.MISSING_REQUIRED_FIELD)

            case '23514':
                error(StatusCodes.UNPROCESSABLE_ENTITY, errors.CHECK_CONSTRAINT_VIOLATION)

            case '22P02':
                error(StatusCodes.BAD_REQUEST, errors.INVALID_DATA_FORMAT)
        }

        error(StatusCodes.INTERNAL_SERVER_ERROR, {
            ...errors.INTERNAL_ERROR,
            message: e.message ?? errors.INTERNAL_ERROR.message
        })
    }
}
