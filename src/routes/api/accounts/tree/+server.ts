import { json, error } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import accountTypes from '$lib/config/account.types'
import userRoles from '$lib/config/user.roles'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq, or, and, getTableColumns, desc, asc, isNull } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as t from '$lib/drizzle/schema'
import errors from '$lib/errors'

/**
 * This is the same with /api/accounts
 * except that this includes the account of the
 * authenticated user
 */

export const POST = async ({ locals }) => {
    const authAccount = locals.account!

    let items: (typeof t.account.$inferSelect)[] = []

    switch (authAccount.type) {
        case accountTypes.DISTRIBUTOR:
            const parent = alias(t.account, 'parent')

            items = await db
                .select({ ...getTableColumns(t.account) })
                .from(t.account)
                .leftJoin(parent, eq(parent.id, t.account.parentId))
                .where(
                    and(
                        or(
                            eq(t.account.id, authAccount.id),
                            eq(t.account.parentId, authAccount.id),
                            eq(parent.parentId, authAccount.id)
                        ),
                        isNull(t.account.deletedAt)
                    )
                )
                .orderBy(desc(t.account.createdAt), asc(t.account.name))

            break

        case accountTypes.DEALER:
            items = await db
                .select()
                .from(t.account)
                .where(or(eq(t.account.id, authAccount.id), eq(t.account.parentId, authAccount.id)))

            break

        default:
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }

    return json({
        data: { items }
    })
}
