import { json, error } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import accountTypes from '$lib/config/account.types'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq, desc } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as table from '$lib/drizzle/schema'

export const POST = async ({ locals, request }) => {
    const account = locals.account!
    let items: (typeof table.account.$inferSelect)[] = []

    switch (account.type) {
        case accountTypes.DISTRIBUTOR:
            const dealer = alias(table.account, accountTypes.DEALER)
            const franchisee = alias(table.account, accountTypes.FRANCHISEE)

            const rows = await db
                .select({
                    dealer,
                    franchisee
                })
                .from(table.account)
                .innerJoin(dealer, eq(dealer.associateId, account.id))
                .innerJoin(franchisee, eq(franchisee.associateId, dealer.id))
                .where(eq(table.account.id, account.id))
                .orderBy(desc(table.account.id))

            items = rows.flatMap(({ dealer, franchisee }) => [dealer, franchisee])
            items = _.uniqBy(items, 'id')

            break

        case accountTypes.DEALER:
            items = await db
                .select()
                .from(table.account)
                .where(eq(table.account.associateId, account.id))
                .orderBy(desc(table.account.id))

            break

        default:
            error(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    }

    return json({
        data: { items }
    })
}
