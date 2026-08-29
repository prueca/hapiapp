/**
 * Server-side load for the distributor freezers list.
 *
 * Responsibilities:
 * - Enforce distributor scoping via `locals.account?.id`; with no id (or no
 *   freezers) it short-circuits to empty results and never hits the DB.
 * - Fetch the distributor's freezers plus the LATEST cabcon (and its account)
 *   for each, then derive the distinct `codeMonths` list for the filter UI.
 *
 * Data flow:
 *   fetchData() is a memoizing IIFE. Both returned promises are `.then` off the
 *   SAME `data` call, so `load` performs a single DB round-trip. Do NOT split
 *   them into two `fetchData()` invocations or the `cached` memo is defeated.
 *
 * Latest-cabcon selection:
 *   Cabcons are ordered `created_at desc, code_month desc`. `_.uniqBy(...,
 *   'freezerId')` runs BEFORE `_.keyBy(..., 'freezerId')` so the first (newest)
 *   row seen for each freezer is the one kept. Order matters.
 *
 * `codeMonths`:
 *   Distinct code months, ordered by the latest `createdAt` within each group
 *   then `code_month` string desc. Uses `_.max(_.map(group, c => c.createdAt
 *   ...))` for the timestamp — NOT `_.maxBy`, which returns the element and
 *   previously caused a 500.
 *
 * Gotchas:
 * - `code_month` is a free-form string; never parse it.
 * - `createdAt` is a JS `Date` (Cabcon model has `timestamps: true`).
 *
 * Returns `{ ...locals, freezers, codeMonths }` as two settled promises.
 */
import _ from 'lodash'
import type { Freezer as FreezerType } from '$lib/types/freezer'

import Freezer from '$lib/db/Freezer'
import Cabcon from '$lib/db/Cabcon'
import Account from '$lib/db/Account'

export const load = async ({ locals }) => {
    const distributorId = locals.account?.id

    let cached: {
           freezers: FreezerType[]
           codeMonths: string[]
    } | undefined

    const fetchData = async () => {
        if (cached) {
            return cached
        }

        if (!distributorId) {
            cached = { freezers: [], codeMonths: [] }
            return cached
        }

        const freezers = await Freezer.findAll({
            where: {
                distributorId
             }
        })

        if (!freezers.length) {
            cached = { freezers: [], codeMonths: [] }
            return cached
        }

        const freezerIds = _.map(freezers, 'id')

        const cabcons = await Cabcon.findAll({
            where: {
                freezerId: freezerIds
             },
            include: [
                 {
                 model: Account,
                 as: 'account',
                 attributes: ['id', 'name', 'type', 'address']
                 }
             ],
            order: [
                 ['created_at', 'desc'],
                 ['code_month', 'desc']
             ]
        })

         // Latest cabcon wins per freezer: newest created_at (code_month as
         // tiebreaker), and uniqBy keeps the first seen per freezerId.
        const latestByFreezer = _.keyBy(_.uniqBy(cabcons, 'freezerId'), 'freezerId')

         // Distinct code months ordered desc by the latest created_at for each
         // code month (code_month string as tiebreaker), sourced from the full
         // cabcon set.
        const codeMonths =
               cabcons.length
                     ?
                     _.chain(cabcons)
                         .filter((c) => Boolean(c.codeMonth))
                         .groupBy('codeMonth')
                         .map((group: any[], codeMonth: string) => ({
                             codeMonth,
                              latest: _.max(_.map(group, (c) => (c.createdAt ? c.createdAt.getTime() : 0)))
                         }))
                         .orderBy(
                                ['latest', 'codeMonth'],
                                ['desc', 'desc']
                         )
                         .map((g: any) => g.codeMonth)
                         .value()
                     : []

        const enriched =
               _.map(freezers, (freezer) => {
                    const cabcon = latestByFreezer[freezer.id]

                    return {
                         ...freezer.toJSON(),
                         cabconStatus: cabcon?.status ?? null,
                         codeMonth: cabcon?.codeMonth ?? null,
                         cabconCreatedAt: cabcon?.createdAt ?? null,
                         accountName: cabcon?.account?.name ?? null,
                         accountType: cabcon?.account?.type ?? null,
                         accountAddress: cabcon?.account?.address ?? null
                     }
               }) as unknown as FreezerType[]

        cached = { freezers: enriched, codeMonths }
        return cached
    }

    const data = fetchData()

    return {
         ...locals,
         freezers: data.then((d) => d.freezers),
         codeMonths: data.then((d) => d.codeMonths)
    }
}
