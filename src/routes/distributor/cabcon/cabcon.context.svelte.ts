import {
    SORT_OPTIONS,
    STATUS_OPTIONS,
    DEFAULT_STATUS_FILTER,
    type CabconRow,
    type CabconMeta,
    type SortKey,
    type StatusFilter
} from '$lib/types/cabcon'
import api from '$lib/api'
import moment from 'moment'
import { invalidateAll, goto } from '$app/navigation'
import _ from 'lodash'

const today = () => new Date().toISOString().slice(0, 10)

const toDateKey = (d: unknown) =>
    d instanceof Date && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : today()

const formatDate = (d: Date) => moment(d).format('MMM-DD-YYYY, ddd')

const errorText = (e: any, fallback: string) =>
    e?.data?.message ?? e?.data?.code ?? e?.message ?? fallback

const DEFAULT_SORT: SortKey = 'codeMonth-desc'

const DEFAULT_CODE_MONTH_FILTER = 'all'

let searchTimer: ReturnType<typeof setTimeout> | undefined

type FormMode = 'create' | 'update'

class Cabcon {
    cabcons: CabconRow[] = $state([])
    meta: CabconMeta = $state({
        sort: DEFAULT_SORT,
        filterStatus: DEFAULT_STATUS_FILTER,
        filterCodeMonth: DEFAULT_CODE_MONTH_FILTER,
        codeMonthOptions: [],
        page: 1,
        hasMore: false
    })

    sort: SortKey = $state(DEFAULT_SORT)
    filterStatus: StatusFilter = $state(DEFAULT_STATUS_FILTER)
    filterCodeMonth = $state(DEFAULT_CODE_MONTH_FILTER)
    page = $state(1)
    hasMore = $state(false)
    canLoadMore = $state(false)

    openFilters = $state(false)

    activeTab = $state<'listing' | 'create'>('create')

    formMode = $state<FormMode>('create')
    editing: CabconRow | null = $state(null)
    newCodeMonth = $state('')
    newCloseDate = $state(today())
    submitting = $state(false)
    submitError = $state('')

    sortOptions = SORT_OPTIONS
    statusOptions = STATUS_OPTIONS

    hasFilters = $derived(
        this.sort !== DEFAULT_SORT ||
            this.filterStatus !== DEFAULT_STATUS_FILTER ||
            this.filterCodeMonth !== DEFAULT_CODE_MONTH_FILTER
    )

    isCreate = $derived(this.formMode === 'create')

    deleting = $state<Set<string>>(new Set())
    pendingDelete: CabconRow | null = $state(null)
    deleteError = $state('')

    private go(
        page: number,
        patch: Partial<{ sort: SortKey; filterStatus: StatusFilter; filterCodeMonth: string }>
    ) {
        const params = new URLSearchParams()
        const sort = patch.sort ?? this.sort
        const filterStatus = patch.filterStatus ?? this.filterStatus
        const filterCodeMonth = patch.filterCodeMonth ?? this.filterCodeMonth

        if (sort && sort !== DEFAULT_SORT) params.set('sort', sort)
        if (filterStatus && filterStatus !== DEFAULT_STATUS_FILTER) {
            params.set('filterStatus', filterStatus)
        }
        if (filterCodeMonth && filterCodeMonth !== DEFAULT_CODE_MONTH_FILTER) {
            params.set('filterCodeMonth', filterCodeMonth)
        }
        if (page > 1) params.set('page', String(page))

        const base = typeof document !== 'undefined' ? document.location.pathname : ''
        const suffix = params.toString()
        goto(suffix ? `${base}?${suffix}` : base, { replaceState: true })
    }

    setSort(sort: SortKey) {
        this.sort = sort
        this.go(1, {})
    }

    setStatusFilter(filterStatus: StatusFilter) {
        this.filterStatus = filterStatus
        this.go(1, {})
    }

    setCodeMonthFilter(value: string) {
        this.filterCodeMonth = value
        this.go(1, {})
    }

    loadMore() {
        if (!this.canLoadMore) return
        this.go(this.page + 1, {})
    }

    closeFilters() {
        this.openFilters = false
    }

    resetFilters() {
        this.sort = DEFAULT_SORT
        this.filterStatus = DEFAULT_STATUS_FILTER
        this.filterCodeMonth = DEFAULT_CODE_MONTH_FILTER
        this.go(1, {})
    }

    load(rows: CabconRow[], meta: CabconMeta) {
        this.cabcons = rows
        this.meta = meta
        this.sort = meta.sort
        this.filterStatus = meta.filterStatus
        this.filterCodeMonth = meta.filterCodeMonth
        this.page = meta.page
        this.hasMore = meta.hasMore
        this.canLoadMore = meta.hasMore
    }

    openCreate() {
        this.formMode = 'create'
        this.editing = null
        this.newCodeMonth = ''
        this.newCloseDate = today()
        this.submitError = ''
        this.activeTab = 'create'
    }

    openEdit(row: CabconRow) {
        this.formMode = 'update'
        this.editing = row
        this.newCodeMonth = row.codeMonth
        this.newCloseDate = toDateKey(row.closeDate)
        this.submitError = ''
        this.activeTab = 'create'
    }

    cancelForm() {
        this.formMode = 'create'
        this.editing = null
        this.newCodeMonth = ''
        this.newCloseDate = today()
        this.submitError = ''
        this.activeTab = 'listing'
    }

    async submit() {
        if (this.submitting) return

        const codeMonth = _.trim(this.newCodeMonth)
        if (!codeMonth) {
            this.submitError = 'Code month is required.'
            return
        }
        if (!this.newCloseDate) {
            this.submitError = 'Close date is required.'
            return
        }

        this.submitting = true
        this.submitError = ''

        try {
            if (this.formMode === 'update' && this.editing) {
                await api.post('cabcon/update', {
                    json: {
                        id: this.editing.id,
                        codeMonth,
                        closeDate: this.newCloseDate
                    }
                })
            } else {
                await api.post('cabcon', {
                    json: {
                        codeMonth,
                        closeDate: this.newCloseDate
                    }
                })
            }

            await invalidateAll()
            this.openCreate()
        } catch (e: any) {
            this.submitError = errorText(
                e,
                'Something went wrong while saving the code of the month.'
            )
        } finally {
            this.submitting = false
        }
    }

    requestDelete(row: CabconRow) {
        this.pendingDelete = row
        this.deleteError = ''
    }

    cancelDelete() {
        this.pendingDelete = null
        this.deleteError = ''
    }

    async confirmDelete() {
        const row = this.pendingDelete
        if (!row || this.isDeleting(row.id)) return

        const next = new Set(this.deleting)
        next.add(row.id)
        this.deleting = next

        try {
            await api.post('cabcon/delete', { json: { id: row.id } })

            this.cabcons = this.cabcons.filter((item) => item.id !== row.id)
            this.pendingDelete = null
            this.deleteError = ''

            await invalidateAll()
        } catch (e: any) {
            this.deleteError = errorText(
                e,
                'Something went wrong while deleting the code of the month.'
            )
        } finally {
            const updated = new Set(this.deleting)
            updated.delete(row.id)
            this.deleting = updated
        }
    }

    isUpdating(id: string) {
        return this.submitting && this.editing?.id === id
    }

    isDeleting(id: string) {
        return this.deleting.has(id)
    }

    formatDate(d: Date) {
        return formatDate(d)
    }
}

const instance = new Cabcon()

export default instance
