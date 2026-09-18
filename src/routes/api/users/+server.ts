import { json, error } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import userRoles from '$lib/config/user.roles'
import errors from '$lib/errors'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq, and, getTableColumns, desc, isNull } from 'drizzle-orm'
import * as t from '$lib/drizzle/schema'

export const POST = async ({ locals }) => {
    const authUser = locals.user!
    const authAccount = locals.account!

    switch (authUser.role) {
        case userRoles.DISTRIBUTOR_ADMIN:
        case userRoles.DISTRIBUTOR_USER:
            // We do not fail the process at this point as
            // these roles are allowed to view users.
            break
        default:
            // Any other roles are not allowed to perform
            // the operation.
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }

    const columns = _.omit({ ...getTableColumns(t.user) }, 'password')

    const items = await db
        .select(columns)
        .from(t.access)
        .innerJoin(t.user, eq(t.user.id, t.access.userId))
        .where(
            and(
                eq(t.access.accountId, authAccount.id),
                isNull(t.access.deletedAt),
                isNull(t.user.deletedAt)
            )
        )
        .orderBy(desc(t.user.createdAt))

    return json({
        data: { items }
    })
}
