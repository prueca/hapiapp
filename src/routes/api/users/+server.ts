import { json, error } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import accountTypes from '$lib/config/account.types'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq, and, getTableColumns, desc, isNull } from 'drizzle-orm'
import * as t from '$lib/drizzle/schema'

export const POST = async ({ locals }) => {
    const account = locals.account!

    const columns = _.omit({ ...getTableColumns(t.user) }, 'password')

    const items = await db
        .select(columns)
        .from(t.access)
        .innerJoin(t.user, eq(t.user.id, t.access.userId))
        .where(
            and(
                eq(t.access.accountId, account.id),
                isNull(t.access.deletedAt),
                isNull(t.user.deletedAt)
            )
        )
        .orderBy(desc(t.user.createdAt))

    return json({
        data: { items }
    })
}
