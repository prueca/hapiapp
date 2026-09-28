import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import { sql } from 'drizzle-orm'

import db from '$lib/drizzle'
import { DEFAULT_STATUS_FILTER, type StatusFilter } from '$lib/config/cabcon.options'
import { type CabconRow, type CabconMeta, type SortKey } from '$lib/types/cabcon'
import errors from '$lib/errors'
import _ from 'lodash'

const PAGE_SIZE = 12
const MAX_ROWS = 600

const SORT_KEYS = new Set<string>([
    'codeMonth-asc',
    'codeMonth-desc',
    'startDate-asc',
    'startDate-desc',
    'endDate-asc',
    'endDate-desc',
    'status-asc',
    'status-desc'
])

const STATUS_VALUES = new Set<string>(['all', 'open', 'closed'])

const STATUS_EXPR = sql`case when "cabcon"."end_date" >= current_date then 'open' else 'closed' end`

const schema = z.object({
    sort: z.string().optional(),
    filterStatus: z.string().optional(),
    filterCodeMonth: z.string().optional(),
    page: z.coerce.number().int().positive().optional()
})

export const POST = async ({ request, locals }) => {
    try {
        const account = locals.account!

        const meta: CabconMeta = {
            sort: 'codeMonth-desc',
            filterStatus: DEFAULT_STATUS_FILTER,
            filterCodeMonth: 'all',
            codeMonthOptions: [],
            page: 1,
            hasMore: false
        }

        if (!account.id) {
            return json({ data: { rows: [] as CabconRow[], meta } })
        }

        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            return json(
                { message: errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const authorId = account.id

        const resolvedSort: SortKey = SORT_KEYS.has(validation.data.sort ?? '')
            ? (validation.data.sort as SortKey)
            : 'codeMonth-desc'

        meta.sort = resolvedSort

        const filterStatus: StatusFilter =
            validation.data.filterStatus && STATUS_VALUES.has(validation.data.filterStatus)
                ? (validation.data.filterStatus as StatusFilter)
                : DEFAULT_STATUS_FILTER

        meta.filterStatus = filterStatus

        const filterCodeMonth = _.trim(validation.data.filterCodeMonth ?? '') || 'all'

        meta.filterCodeMonth = filterCodeMonth

        const page =
            validation.data.page &&
            Number.isFinite(validation.data.page) &&
            validation.data.page > 0
                ? Math.floor(validation.data.page)
                : 1

        meta.page = page

        const cap = Math.min(page * PAGE_SIZE, MAX_ROWS)

        const today = new Date().toISOString().slice(0, 10)
        const statusOf = (row: CabconRow): 'open' | 'closed' =>
            (row.endDate as Date).toISOString().slice(0, 10) >= today ? 'open' : 'closed'

        const rows = (await db.query.cabcon.findMany({
            where: (cabcon, { and, eq, isNull }) =>
                and(eq(cabcon.authorId, authorId), isNull(cabcon.deletedAt)),
            orderBy: (cabcon, { asc }) => asc(cabcon.codeMonth),
            limit: MAX_ROWS + 1,
            extras: {
                status: STATUS_EXPR.as('status')
            }
        })) as CabconRow[]

        const codeMonthOptions = rows.map((row) => row.codeMonth)

        const filtered = rows.filter((row) => {
            if (filterCodeMonth !== 'all' && row.codeMonth !== filterCodeMonth) return false
            if (filterStatus !== 'all' && statusOf(row) !== filterStatus) return false
            return true
        })

        filtered.sort((a, b) => {
            switch (resolvedSort) {
                case 'codeMonth-asc':
                    return a.codeMonth.localeCompare(b.codeMonth)
                case 'codeMonth-desc':
                    return b.codeMonth.localeCompare(a.codeMonth)
                case 'startDate-asc':
                    return (a.startDate as Date).getTime() - (b.startDate as Date).getTime()
                case 'startDate-desc':
                    return (b.startDate as Date).getTime() - (a.startDate as Date).getTime()
                case 'endDate-asc':
                    return (a.endDate as Date).getTime() - (b.endDate as Date).getTime()
                case 'endDate-desc':
                    return (b.endDate as Date).getTime() - (a.endDate as Date).getTime()
                case 'status-asc':
                    return statusOf(a).localeCompare(statusOf(b))
                case 'status-desc':
                default:
                    return statusOf(b).localeCompare(statusOf(a))
            }
        })

        const data = filtered.slice(0, cap)

        meta.codeMonthOptions = codeMonthOptions
        meta.hasMore = filtered.length > cap

        return json({ data: { rows: data, meta } })
    } catch (e: any) {
        if (isHttpError(e)) throw e

        const code = _.get(e, 'cause.code', null)

        switch (code) {
            case '23503':
                error(StatusCodes.UNPROCESSABLE_ENTITY, errors.FOREIGN_KEY_VIOLATION)
                break

            default:
                error(StatusCodes.INTERNAL_SERVER_ERROR, {
                    ...errors.INTERNAL_ERROR,
                    message: e.message ?? errors.INTERNAL_ERROR.message
                })
                break
        }
    }
}
