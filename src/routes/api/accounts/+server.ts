import { json, error } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import accountTypes from '$lib/config/account.types'
import userRoles from '$lib/config/user.roles'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq, or, and, getTableColumns, desc, asc, isNull, ilike } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as t from '$lib/drizzle/schema'
import errors from '$lib/errors'

const SEARCH_LIMIT = 50

export const POST = async ({ request, locals }) => {
    const authAccount = locals.account!

    const body = await request.json()
    const query = _.trim(String(body.query) ?? '')

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
                    items: query ? await queryBuilder.limit(SEARCH_LIMIT) : await queryBuilder
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
                    items: query ? await queryBuilder.limit(SEARCH_LIMIT) : await queryBuilder
                }
            })
        }

        default:
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }
}
