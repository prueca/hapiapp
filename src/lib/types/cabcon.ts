import { cabcon } from '$lib/drizzle/schema/cabcon'
import {
    type StatusFilter,
    STATUS_OPTIONS,
    DEFAULT_STATUS_FILTER
} from '$lib/config/cabcon.options'

export { type StatusFilter, STATUS_OPTIONS, DEFAULT_STATUS_FILTER }
export type { CodeMonthStatusValue } from '$lib/config/cabcon.options'

export type Cabcon = typeof cabcon.$inferSelect

export type CabconRow = Cabcon & {
    status: 'open' | 'closed'
}

export type SortKey =
    | 'codeMonth-asc'
    | 'codeMonth-desc'
    | 'startDate-asc'
    | 'startDate-desc'
    | 'endDate-asc'
    | 'endDate-desc'
    | 'status-asc'
    | 'status-desc'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'codeMonth-desc', label: 'Code Month (Newest)' },
    { value: 'codeMonth-asc', label: 'Code Month (Oldest)' },
    { value: 'startDate-desc', label: 'Start Date (Latest)' },
    { value: 'startDate-asc', label: 'Start Date (Earliest)' },
    { value: 'endDate-desc', label: 'End Date (Latest)' },
    { value: 'endDate-asc', label: 'End Date (Earliest)' },
    { value: 'status-desc', label: 'Status (Z-A)' },
    { value: 'status-asc', label: 'Status (A-Z)' }
]

export type CabconMeta = {
    sort: SortKey
    filterStatus: StatusFilter
    filterCodeMonth: string
    query: string
    codeMonthOptions: string[]
    page: number
    hasMore: boolean
}
