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

export const POST = async ({ locals }) => {
    const authUser = locals.user!
    const authAccount = locals.account!

    switch (authUser.role) {
        case userRoles.DISTRIBUTOR_ADMIN:
        case userRoles.DISTRIBUTOR_USER:
            // We do not fail the process at this point as
            // these roles are allowed to view accounts.
            break
        default:
            // Any other roles are not allowed to perform
            // the operation.
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }

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
                            eq(t.account.parentId, authAccount.id),
                            eq(parent.parentId, authAccount.id)
                        ),
                        isNull(t.account.deletedAt)
                    )
                )
                .orderBy(desc(t.account.createdAt), asc(t.account.name))

            break

        case accountTypes.DEALER:
            items = await db.select().from(t.account).where(eq(t.account.parentId, authAccount.id))

            break

        default:
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }

    return json({
        data: { items }
    })
}
