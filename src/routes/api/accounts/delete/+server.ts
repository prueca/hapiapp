import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import errors from '$lib/errors'
import _ from 'lodash'
import userRoles from '$lib/config/user.roles'

import db from '$lib/drizzle'
import { eq, or, and, isNull } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as t from '$lib/drizzle/schema'

const schema = z.object({
    id: z.ulid()
})

const verifyAccess = async (authAccountId: string, id: string) => {
    const parent = alias(t.account, 'parent')

    const [account] = await db
        .select()
        .from(t.account)
        .leftJoin(parent, eq(parent.id, t.account.parentId))
        .where(
            and(
                eq(t.account.id, id),
                isNull(t.account.deletedAt),
                or(eq(t.account.parentId, authAccountId), eq(parent.parentId, authAccountId))
            )
        )
        .limit(1)

    if (!account) {
        error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }
}

export const POST = async ({ locals, request }) => {
    try {
        const authAccount = locals.account!
        const authUser = locals.user!

        switch (authUser.role) {
            case userRoles.DISTRIBUTOR_ADMIN:
                // We do not fail the process at this point as
                // these roles are allowed to delete account.
                break
            default:
                // Any other roles are not allowed to perform
                // the operation.
                error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
        }

        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            error(StatusCodes.BAD_REQUEST, errors.INVALID_DATA_FORMAT)
        }

        const { id: accountId } = validation.data

        await verifyAccess(authAccount.id, accountId)

        const deletedAccount = await db.transaction(async (txn) => {
            const [account] = await db
                .update(t.account)
                .set({
                    deletedAt: new Date()
                })
                .where(and(eq(t.account.id, accountId), isNull(t.account.deletedAt)))
                .returning()

            await db
                .update(t.access)
                .set({
                    deletedAt: new Date()
                })
                .where(and(eq(t.access.accountId, accountId), isNull(t.access.deletedAt)))
                .returning()

            if (!account) {
                error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
            }

            return account
        })

        return json({ data: deletedAccount })
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
