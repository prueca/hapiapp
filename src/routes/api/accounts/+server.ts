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
            const hapistore = alias(table.account, accountTypes.HAPISTORE)

            const rows = await db
                .select({
                    dealer,
                    hapistore
                })
                .from(table.account)
                .leftJoin(dealer, eq(dealer.associateId, account.id))
                .leftJoin(hapistore, eq(hapistore.associateId, dealer.id))
                .where(eq(table.account.id, account.id))

            items = rows.flatMap(({ dealer, hapistore }) => _.compact([dealer, hapistore]))
            items = _.uniqBy(items, 'id')

            break

        case accountTypes.DEALER:
            items = await db
                .select()
                .from(table.account)
                .where(eq(table.account.associateId, account.id))

            break

        default:
            error(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    }

    return json({
        data: { items }
    })
}
