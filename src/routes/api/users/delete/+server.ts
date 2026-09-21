import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import errors from '$lib/errors'
import _ from 'lodash'
import userRoles from '$lib/config/user.roles'

import db from '$lib/drizzle'
import { eq, and, isNull } from 'drizzle-orm'
import * as t from '$lib/drizzle/schema'

const schema = z.object({
    id: z.ulid()
})

const verifyAccess = async (authAccountId: string, userId: string) => {
    const [user] = await db
        .select()
        .from(t.user)
        .innerJoin(t.access, eq(t.access.userId, t.user.id))
        .where(
            and(
                eq(t.access.accountId, authAccountId),
                isNull(t.access.deletedAt),
                isNull(t.user.deletedAt),
                eq(t.user.id, userId)
            )
        )
        .limit(1)

    if (!user) {
        error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
    }
}

export const POST = async ({ locals, request }) => {
    try {
        const authAccount = locals.account!
        const authUser = locals.user!

        switch (authUser.role) {
            case userRoles.DISTRIBUTOR_ADMIN:
                // Users with these roles are allowed
                // to proceed with the operation
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

        const { id: userId } = validation.data

        await verifyAccess(authAccount.id, userId)

        const deletedUser = await db.transaction(async (txn) => {
            const [user] = await db
                .update(t.user)
                .set({
                    deletedAt: new Date()
                })
                .where(and(eq(t.user.id, userId), isNull(t.user.deletedAt)))
                .returning()

            await db
                .update(t.access)
                .set({
                    deletedAt: new Date()
                })
                .where(and(eq(t.access.userId, userId), isNull(t.access.deletedAt)))

            if (!user) {
                error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
            }

            return user
        })

        return json({ data: deletedUser })
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
