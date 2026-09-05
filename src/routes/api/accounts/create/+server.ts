import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import z, { ZodObject } from 'zod'
import accountTypes from '$lib/config/account.types'
import { customAlphabet } from 'nanoid'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10)

const schema: ZodObject = z.object({
    type: z.enum([accountTypes.DEALER, accountTypes.HAPISTORE]),
    name: z.string().nonempty(),
    address: z.string().nonempty(),
    phone: z.string().nonempty(),
    isrCode: z.string().nonempty(),
    sapCode: z.string().nonempty(),
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
            companyCode: nanoid(),
            parentId: account.id,
            active: true
        }

        const validation = schema.safeParse(data)

        if (!validation.success) {
            error(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
        }

        const scope: Json = {
            [accountTypes.DISTRIBUTOR]: [accountTypes.DISTRIBUTOR, accountTypes.HAPISTORE],
            [accountTypes.DEALER]: [accountTypes.HAPISTORE]
        }

        const allowedTypes: string[] | undefined = scope[account.type]

        if (!allowedTypes || !allowedTypes.includes(data.type)) {
            // Distributor > Dealer > Hapistore
            // An account equal to or higher than the user's
            // account type cannot be created.
            error(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
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

        const message = e.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR

        error(StatusCodes.INTERNAL_SERVER_ERROR, message)
    }
}
