import { json, error } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import accountTypes from '$lib/config/account.types'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq, getTableColumns, or, and } from 'drizzle-orm'
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
                .leftJoin(parent, eq(t.account.associateId, parent.id))
                .where(
                    or(
                        and(
                            eq(t.account.type, accountTypes.DEALER),
                            eq(t.account.associateId, account.id)
                        ),
                        and(
                            eq(t.account.type, accountTypes.HAPISTORE),
                            eq(parent.associateId, account.id)
                        )
                    )
                )

            break

        case accountTypes.DEALER:
            items = await db.select().from(t.account).where(eq(t.account.associateId, account.id))

            break

        default:
            error(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    }

    return json({
        data: { items }
    })
}
