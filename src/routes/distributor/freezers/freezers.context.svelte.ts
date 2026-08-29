/**
 * Freezers list UI context (singleton).
 *
 * The default-exported `Freezers` instance is the single source of truth every
 * component in this route binds to (Toolbar, Filters, List, Item).
 *
 * Mutable fields ($state):
 *   items, codeMonths, query, sort, statusFilter, typeFilter, codeMonthFilter,
 *   visibleCount, openFilters. `pageSize = 12` is a fixed const.
 *
 * Derivations ($derived):
 *   - codeMonthFilterOptions: `['all', ...codeMonths]` for the filter dropdown.
 *   - filtered: status / type / codeMonth matches plus a free-text search across
 *     10 fields (model, brand, barcode, capacity, yearModel, cabconStatus,
 *     codeMonth, accountName, accountType, accountAddress).
 *   - sorted: applies `sortItems` to `filtered`.
 *   - hasFilters: any filter/sort/search deviating from defaults (drives the
 *     "Clear filters" affordance).
 *   - visible / canLoadMore: windowing slice of `sorted` for "Load more".
 *
 * `sortItems`: `createdAt-desc` orders by `cabconCreatedAt` desc with `codeMonth`
 * desc as tiebreak; other keys sort by yearModel / cabconStatus / accountName /
 * accountType.
 *
 * Methods: `load`, `loadMore`, `resetFilters`, `resetVisibleCount`,
 * `closeFilters`.
 */
import {
    SORT_OPTIONS,
    STATUS_FILTER_OPTIONS,
    TYPE_FILTER_OPTIONS,
    type Freezer as FreezerType,
    type SortKey,
    type StatusFilter,
    type TypeFilter,
    type CodeMonthFilter
} from '$lib/types/freezer'
import _ from 'lodash'

class Freezers {
    items: FreezerType[] = $state([])
    codeMonths: string[] = $state([])

    query = $state('')
    sort: SortKey = $state('createdAt-desc')
    statusFilter: StatusFilter = $state('all')
    typeFilter: TypeFilter = $state('all')
    codeMonthFilter: CodeMonthFilter = $state('all')

    pageSize = 12
    visibleCount = $state(12)

    openFilters = $state(false)

    sortOptions = SORT_OPTIONS
    statusFilterOptions = STATUS_FILTER_OPTIONS
    typeFilterOptions = TYPE_FILTER_OPTIONS

    codeMonthFilterOptions: CodeMonthFilter[] = $derived([
          'all',
          ...this.codeMonths
     ])

    filtered = $derived(
        _.chain(this.items)
            .filter((f) =>
                this.statusFilter === 'all' ? true : f.cabconStatus === this.statusFilter
            )
            .filter((f) => (this.typeFilter === 'all' ? true : f.accountType === this.typeFilter))
            .filter((f) =>
                this.codeMonthFilter === 'all' ? true : f.codeMonth === this.codeMonthFilter
            )
            .filter((f) => {
                const q = _.toLower(_.trim(this.query))
                if (!q) return true
                return _.some(
                    [
                        f.model,
                        f.brand,
                        f.barcode,
                        f.capacity,
                        f.yearModel,
                        f.cabconStatus,
                        f.codeMonth,
                         f.accountName,
                         f.accountType,
                         f.accountAddress
                    ],
                    (field) =>
                        field !== null &&
                        field !== undefined &&
                        _.includes(_.toLower(String(field)), q)
                )
            })
            .value()
    )

    sorted = $derived(sortItems(this.filtered, this.sort))

    hasFilters = $derived(
        this.query !== '' ||
            this.sort !== 'createdAt-desc' ||
            this.statusFilter !== 'all' ||
            this.typeFilter !== 'all' ||
            this.codeMonthFilter !== 'all'
    )

    visible = $derived(this.sorted.slice(0, this.visibleCount))
    canLoadMore = $derived(this.visibleCount < this.sorted.length)

    closeFilters() {
        this.openFilters = false
    }

    resetFilters() {
        this.query = ''
        this.sort = 'createdAt-desc'
        this.statusFilter = 'all'
        this.typeFilter = 'all'
        this.codeMonthFilter = 'all'
    }

    resetVisibleCount() {
        this.visibleCount = this.pageSize
    }

    loadMore() {
        this.visibleCount += this.pageSize
    }

    load(items: FreezerType[], codeMonths: string[] = []) {
        this.items = items
        this.codeMonths = codeMonths
        this.resetVisibleCount()
     }
}

const sortItems = (items: FreezerType[], sort: SortKey) => {
    switch (sort) {
        case 'createdAt-desc':
            return _.orderBy(
                items,
                [(f) => f.cabconCreatedAt ?? '', (f) => f.codeMonth ?? ''],
                ['desc', 'desc']
            )

        case 'yearModel-asc':
            return _.orderBy(items, (f) => f.yearModel ?? -Infinity, 'asc')

        case 'yearModel-desc':
            return _.orderBy(items, (f) => f.yearModel ?? -Infinity, 'desc')

        case 'cabconStatus':
            return _.orderBy(items, (f) => f.cabconStatus ?? '', 'asc')

        case 'accountName':
            return _.orderBy(items, (f) => f.accountName ?? '', 'asc')

        case 'accountType':
            return _.orderBy(items, (f) => f.accountType ?? '', 'asc')

        default:
            return items
    }
}

const instance = new Freezers()

export default instance
