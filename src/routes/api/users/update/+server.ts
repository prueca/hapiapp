import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import accountTypes from '$lib/config/account.types'
import userRoles from '$lib/config/user.roles'
import errors from '$lib/errors'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq, or, and, isNull, getTableColumns } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as t from '$lib/drizzle/schema'

const schema = z.object({
    id: z.ulid(),
    isAdmin: z.boolean(),

    firstName: z.string().nonempty(),
    middleName: z.string().nullable(),
    lastName: z.string().nonempty(),

    address: z.string().nonempty(),
    phone: z.string().nonempty()
})

const verifyAccess = async (authAccountId: string, userId: string) => {
    const [access] = await db
        .select()
        .from(t.access)
        .where(
            and(
                eq(t.access.accountId, authAccountId),
                eq(t.access.userId, userId),
                isNull(t.access.deletedAt)
            )
        )
        .limit(1)

    if (!access) {
        error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
    }

    return true
}

const getUserRole = (accountType: string, isAdmin: boolean) => {
    switch (accountType) {
        case accountTypes.DISTRIBUTOR:
            return isAdmin ? userRoles.DISTRIBUTOR_ADMIN : userRoles.DISTRIBUTOR_USER

        case accountTypes.DEALER:
            return isAdmin ? userRoles.DEALER_ADMIN : userRoles.DEALER_USER

        case accountTypes.HAPISTORE:
            return isAdmin ? userRoles.HAPISTORE_ADMIN : userRoles.HAPISTORE_USER

        case accountTypes.DIRECT_STORE:
            return isAdmin ? userRoles.DIRECT_STORE_ADMIN : userRoles.DIRECT_STORE_USER

        default:
            error(StatusCodes.BAD_REQUEST, errors.INVALID_DATA_FORMAT)
    }
}

export const POST = async ({ locals, request }) => {
    try {
        const authAccount = locals.account!
        const authUser = locals.user!

        switch (authUser.role) {
            case userRoles.DISTRIBUTOR_ADMIN:
                // Users with roles from these cases are allowed
                // to update a user
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

        const { id: userId, isAdmin, ...rest } = validation.data

        await verifyAccess(authAccount.id, userId)

        const values = {
            ...rest,
            role: getUserRole(authAccount.type, isAdmin),
            updatedAt: new Date()
        }

        const [updatedUser] = await db
            .update(t.user)
            .set(values)
            .where(eq(t.user.id, userId))
            .returning()

        if (!updatedUser) {
            error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
        }

        return json({ data: updatedUser })
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
