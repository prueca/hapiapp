import { json, error } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import accountTypes from '$lib/config/account.types'
import userRoles from '$lib/config/user.roles'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq, or, and, getTableColumns, desc, asc, isNull, ilike } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as t from '$lib/drizzle/schema'
import errors from '$lib/errors'

const schema = z.object({
    query: z.string().optional()
})

const SEARCH_LIMIT = 50

export const POST = async ({ request, locals }) => {
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

    const raw = (await request.json().catch(() => ({}))) as z.infer<typeof schema>
    const query = _.trim(raw.query ?? '')

    const search = (column: any) => {
        if (!query) return undefined
        const like = `%${query}%`
        return or(ilike(column, like), ilike(t.account.id, like))
    }

    switch (authAccount.type) {
        case accountTypes.DISTRIBUTOR: {
            const parent = alias(t.account, 'parent')
            const where = search(t.account.name)

            const queryBuilder = db
                 .select({ ...getTableColumns(t.account) })
                 .from(t.account)
                 .leftJoin(parent, eq(parent.id, t.account.parentId))
                 .where(
                      and(
                           or(
                                eq(t.account.parentId, authAccount.id),
                                eq(parent.parentId, authAccount.id)
                          ),
                          isNull(t.account.deletedAt),
                          where
                    )
                )
                 .orderBy(desc(t.account.createdAt), asc(t.account.name))

            return json({
                 data: {
                      items: query ? await queryBuilder.limit(SEARCH_LIMIT) : queryBuilder
                   }
             })
         }

        case accountTypes.DEALER: {
            const where = search(t.account.name)
            const queryBuilder = db
                 .select()
                 .from(t.account)
                 .where(and(eq(t.account.parentId, authAccount.id), where))

            return json({
                 data: {
                      items: query ? await queryBuilder.limit(SEARCH_LIMIT) : queryBuilder
                   }
             })
         }

        default:
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }
}
