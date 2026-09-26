import db from '$lib/drizzle'
import { DEFAULT_STATUS_FILTER, type StatusFilter } from '$lib/config/cabcon.options'
import { sql, eq, and, asc, isNull } from 'drizzle-orm'
import type { CabconRow, CabconMeta, SortKey } from '$lib/types/cabcon'

const PAGE_SIZE = 12
const MAX_ROWS = 600

const SORT_KEYS = new Set<string>([
    'codeMonth-asc',
    'codeMonth-desc',
    'closeDate-asc',
    'closeDate-desc',
    'status-asc',
    'status-desc'
])

const STATUS_VALUES = new Set<string>(['all', 'open', 'closed'])

const STATUS_EXPR = sql`case when "cabcon"."close_date" >= current_date then 'open' else 'closed' end`

export const load = async ({ locals, url }) => {
    const authorId = locals.account?.id

    const rawFilter = url.searchParams.get('filterStatus')
    const filterStatus: StatusFilter =
        rawFilter && STATUS_VALUES.has(rawFilter)
            ? (rawFilter as StatusFilter)
            : DEFAULT_STATUS_FILTER

    const filterCodeMonth = (url.searchParams.get('filterCodeMonth') ?? 'all').trim() || 'all'

    const rawSort = url.searchParams.get('sort')
    const sort: SortKey = SORT_KEYS.has(rawSort ?? '') ? (rawSort as SortKey) : 'codeMonth-desc'

    const rawPage = Number(url.searchParams.get('page'))
    const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1

    const cap = Math.min(page * PAGE_SIZE, MAX_ROWS)

    const meta: CabconMeta = {
        sort,
        filterStatus,
        filterCodeMonth,
        codeMonthOptions: [],
        page,
        hasMore: false
    }

    if (!authorId) {
        return { data: [] as CabconRow[], meta }
    }

    const today = new Date().toISOString().slice(0, 10)
    const statusOf = (row: CabconRow): 'open' | 'closed' =>
        (row.closeDate as Date).toISOString().slice(0, 10) >= today ? 'open' : 'closed'

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
        switch (sort) {
            case 'codeMonth-asc':
                return a.codeMonth.localeCompare(b.codeMonth)
            case 'codeMonth-desc':
                return b.codeMonth.localeCompare(a.codeMonth)
            case 'closeDate-asc':
                return (a.closeDate as Date).getTime() - (b.closeDate as Date).getTime()
            case 'closeDate-desc':
                return (b.closeDate as Date).getTime() - (a.closeDate as Date).getTime()
            case 'status-asc':
                return statusOf(a).localeCompare(statusOf(b))
            case 'status-desc':
            default:
                return statusOf(b).localeCompare(statusOf(a))
        }
    })

    const data = filtered.slice(0, cap)
    meta.hasMore = filtered.length > cap
    meta.codeMonthOptions = codeMonthOptions

    return { data, meta }
}
