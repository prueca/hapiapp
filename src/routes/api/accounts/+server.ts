import { json, error } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import accountTypes from '$lib/config/account.types'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq, or, getTableColumns, asc } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as t from '$lib/drizzle/schema'

export const POST = async ({ locals }) => {
    const account = locals.account!

    let items: (typeof t.account.$inferSelect)[] = []

    switch (account.type) {
        case accountTypes.DISTRIBUTOR:
            const parent = alias(t.account, 'parent')

            items = await db
                .select({ ...getTableColumns(t.account) })
                .from(t.account)
                .leftJoin(parent, eq(parent.id, t.account.parentId))
                .where(or(eq(t.account.parentId, account.id), eq(parent.parentId, account.id)))
                .orderBy(asc(t.account.name))

            break

        case accountTypes.DEALER:
            items = await db.select().from(t.account).where(eq(t.account.parentId, account.id))

            break

        default:
            error(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    }

    return json({
        data: { items }
    })
}
