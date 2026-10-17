import { json, error } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import accountTypes from '$lib/config/account.types'
import z from 'zod'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq, or, and, getTableColumns, desc, asc, isNull, ilike } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as t from '$lib/drizzle/schema'
import errors from '$lib/errors'

const schema = z.object({
    query: z.string().optional()
})

export const POST = async ({ locals, request }) => {
    const authAccount = locals.account!

    // Check access

    if (authAccount.type !== accountTypes.DISTRIBUTOR) {
        error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }

    // Validate payload

    const payload = await request.json()
    const { data, success } = schema.safeParse(payload)

    if (!success) {
        error(StatusCodes.BAD_REQUEST, errors.INVALID_DATA_FORMAT)
    }

    // `query` can be account id or name

    const { query } = data
    const queryCondition = query
        ? or(ilike(t.account.name, `%${query}%`), eq(t.account.id, query))
        : undefined

    const parent = alias(t.account, 'parent')

    const items = await db
        .select({ ...getTableColumns(t.account) })
        .from(t.account)
        .leftJoin(parent, eq(parent.id, t.account.parentId))
        .where(
            and(
                isNull(t.account.deletedAt),
                eq(t.account.active, true),
                or(eq(t.account.parentId, authAccount.id), eq(parent.parentId, authAccount.id)),
                queryCondition
            )
        )
        .orderBy(desc(t.account.createdAt), asc(t.account.name))

    return json({
        data: { items }
    })
}
