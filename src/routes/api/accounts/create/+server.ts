import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import z, { ZodObject } from 'zod'
import accountTypes from '$lib/config/account.types'
import errors from '$lib/errors'
import _ from 'lodash'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'

const schema: ZodObject = z.object({
    type: z.enum([accountTypes.DEALER, accountTypes.HAPISTORE]),
    name: z.string().nonempty(),
    address: z.string().nonempty(),
    phone: z.string().nonempty(),
    isrCode: z.string().nonempty().nullable(),
    sapCode: z.string().nonempty().nullable(),
    parentId: z.ulid(),
    active: z.boolean()
})

export const POST = async ({ locals, request }) => {
    try {
        const account = locals.account!
        const user = locals.user!
        const payload = await request.json()

        let data: typeof t.account.$inferInsert = {
            ...payload,
            parentId: account.id,
            active: true
        }

        const validation = schema.safeParse(data)

        if (!validation.success) {
            error(StatusCodes.BAD_REQUEST, errors.INVALID_DATA_FORMAT)
        }

        const scope: Json = {
            [accountTypes.DISTRIBUTOR]: [accountTypes.DEALER, accountTypes.HAPISTORE],
            [accountTypes.DEALER]: [accountTypes.HAPISTORE]
        }

        const allowedTypes: string[] | undefined = scope[account.type]

        if (!allowedTypes || !allowedTypes.includes(data.type)) {
            // Distributor > Dealer > Hapistore
            // An account equal to or higher than the user's
            // account type cannot be created.
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
        }

        const result = await db.transaction(async (txn) => {
            const [newAccount] = await txn.insert(t.account).values(data).returning()

            // Allow current user to access the newly created account
            // by creating access record.
            await txn.insert(t.access).values({
                userId: user.id,
                accountId: newAccount.id
            })

            return newAccount
        })

        return json({ data: result })
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
