import _ from 'lodash'
import z from 'zod'
import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import accountTypes from '$lib/config/account.types'
import userRoles from '$lib/config/user.roles'
import errors from '$lib/errors'
import { generateUsername } from 'unique-username-generator'
import * as argon2 from 'argon2'

import db from '$lib/drizzle'
import { eq, or, and, isNull, getTableColumns } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as t from '$lib/drizzle/schema'

type User = typeof t.user.$inferInsert

const DEFAULT_PASSWORD = 'hapi123'

const schema = z.object({
    accountId: z.ulid(),
    firstName: z.string(),
    middleName: z.string().nullable(),
    lastName: z.string(),
    address: z.string(),
    phone: z.string(),
    isAdmin: z.boolean()
})

const fetchAccount = async (authAccountId: string, accountId: string) => {
    const parent = alias(t.account, 'parent')

    const [account] = await db
        .select({ ...getTableColumns(t.account) })
        .from(t.account)
        .leftJoin(parent, eq(parent.id, t.account.parentId))
        .where(
            and(
                eq(t.account.id, accountId),
                isNull(t.account.deletedAt),
                or(
                    eq(t.account.id, authAccountId),
                    eq(t.account.parentId, authAccountId),
                    eq(parent.parentId, authAccountId)
                )
            )
        )
        .limit(1)

    if (!account) {
        error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }

    return account
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
                // to create a user
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

        const { data } = validation
        const account = await fetchAccount(authAccount.id, data.accountId)
        const userData = _.pick(data, ['firstName', 'middleName', 'lastName', 'address', 'phone'])

        _.assign(userData, {
            role: getUserRole(account.type, data.isAdmin),
            username: generateUsername('_', 4),
            // We use a default password for the new user.
            // This can be changed later.
            password: await argon2.hash(DEFAULT_PASSWORD)
        })

        const newUser = await db.transaction(async (txn) => {
            const [newUser] = await txn
                .insert(t.user)
                .values(userData as User)
                .returning()

            await txn.insert(t.access).values({
                userId: newUser.id,
                accountId: data.accountId
            })

            return newUser
        })

        return json(_.pick(newUser, ['username', 'password']))
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
