import {
    SORT_OPTIONS,
    STATUS_FILTER_OPTIONS,
    DEFAULT_STATUS_FILTER,
    type Freezer as FreezerType,
    type SortKey,
    type StatusFilter
} from '$lib/types/freezer'
import { invalidateAll } from '$app/navigation'
import api from '$lib/api'
import { modelOptions, capacityOptions, yearModelOptions, brandOptions } from '$lib/config/freezer.options'
import _ from 'lodash'

class Freezers {
    items: FreezerType[] = $state([])

    query = $state('')
    sort: SortKey = $state('createdAt-desc')
    statusFilter: StatusFilter = $state(DEFAULT_STATUS_FILTER)

    pageSize = 12
    visibleCount = $state(12)

    openFilters = $state(false)

    openCreate = $state(false)
    submitting = $state(false)
    error = $state('')

    newModel = $state('')
    newCapacity = $state('')
    newBrand = $state('')
    newYearModel = $state('')
    newBarcode = $state('')

    sortOptions = SORT_OPTIONS
    statusFilterOptions = STATUS_FILTER_OPTIONS
     modelOptions = modelOptions as unknown as string[]
     capacityOptions = capacityOptions as unknown as number[]
     yearModelOptions = yearModelOptions as unknown as number[]
     brandOptions = brandOptions as unknown as string[]

    filtered = $derived(
        _.chain(this.items)
            .filter((f) => (this.statusFilter === 'all' ? true : f.status === this.statusFilter))
            .filter((f) => {
                const q = _.toLower(_.trim(this.query))
                if (!q) return true
                return _.some(
                    [f.model, f.brand, f.barcode, f.capacity, f.yearModel],
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
            this.statusFilter !== DEFAULT_STATUS_FILTER
    )

    visible = $derived(this.sorted.slice(0, this.visibleCount))
    canLoadMore = $derived(this.visibleCount < this.sorted.length)

    closeFilters() {
        this.openFilters = false
    }

    resetFilters() {
        this.query = ''
        this.sort = 'createdAt-desc'
        this.statusFilter = DEFAULT_STATUS_FILTER
    }

    resetVisibleCount() {
        this.visibleCount = this.pageSize
    }

    loadMore() {
        this.visibleCount += this.pageSize
    }

    load(items: FreezerType[]) {
        this.items = items
        this.resetVisibleCount()
    }

    closeCreate() {
        this.openCreate = false
    }

    resetCreateForm() {
        this.newModel = ''
        this.newCapacity = ''
        this.newBrand = ''
        this.newYearModel = ''
        this.newBarcode = ''
    }

    async submitCreate() {
        this.submitting = true
        this.error = ''

        try {
            const res = await api.post('freezers', {
                json: {
                    model: this.newModel,
                    capacity: Number(this.newCapacity),
                    brand: this.newBrand,
                    yearModel: Number(this.newYearModel),
                    barcode: this.newBarcode
                }
            })

            await res.json()

            this.closeCreate()
            this.resetCreateForm()

            await invalidateAll()
        } catch (e: any) {
            const data = e?.data

            const message: string | null =
                typeof data === 'object' && data !== null && typeof data.message === 'string'
                    ? data.message
                    : typeof data === 'string'
                      ? data
                      : e?.response?.statusText || e?.message || null

            this.error = message || 'Something went wrong while creating the freezer.'
        } finally {
            this.submitting = false
        }
    }
}

const sortItems = (items: FreezerType[], sort: SortKey) => {
    switch (sort) {
        case 'createdAt-desc':
            return _.orderBy(items, [(f) => (f.createdAt ? f.createdAt.getTime() : 0)], ['desc'])

        case 'model':
            return _.orderBy(items, (f) => _.toLower(f.model), 'asc')

        case 'yearModel-asc':
            return _.orderBy(items, (f) => f.yearModel, 'asc')

        case 'yearModel-desc':
            return _.orderBy(items, (f) => f.yearModel, 'desc')

        default:
            return items
    }
}

const instance = new Freezers()

export default instance
