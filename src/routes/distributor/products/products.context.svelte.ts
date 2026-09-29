import {
    SORT_OPTIONS,
    PRODUCT_CATEGORY_OPTIONS,
    PRODUCT_PACKAGING_OPTIONS,
    PRODUCT_ENLISTED_FOR_OPTIONS,
    PRODUCT_ENLISTED_FOR_OPTIONS_ALL,
    DEFAULT_CATEGORY_FILTER,
    DEFAULT_PACKAGING_FILTER,
    DEFAULT_ENLISTED_FOR_FILTER,
    type ProductRow,
    type ProductMeta,
    type SortKey,
    type CategoryFilter,
    type PackagingFilter,
    type EnlistedForFilter
} from '$lib/types/product'
import api from '$lib/api'
import moment from 'moment'
import { invalidateAll, goto } from '$app/navigation'
import _ from 'lodash'

const DEFAULT_SORT: SortKey = 'createdAt-desc'

type FormMode = 'create' | 'update'

const errorText = (e: any, fallback: string) =>
    e?.data?.message ?? e?.data?.code ?? e?.message ?? fallback

const formatDate = (d: Date) => moment(d).format('MMM-DD-YYYY, ddd')

class Products {
    products: ProductRow[] = $state([])
    meta: ProductMeta = $state({
        sort: DEFAULT_SORT,
        filterCategory: DEFAULT_CATEGORY_FILTER,
        filterPackaging: DEFAULT_PACKAGING_FILTER,
        filterEnlistedFor: DEFAULT_ENLISTED_FOR_FILTER,
        categoryOptions: [],
        packagingOptions: [],
        enlistedForOptions: [],
        page: 1,
        hasMore: false
    })

    sort: SortKey = $state(DEFAULT_SORT)
    filterCategory: CategoryFilter = $state(DEFAULT_CATEGORY_FILTER)
    filterPackaging: PackagingFilter = $state(DEFAULT_PACKAGING_FILTER)
    filterEnlistedFor: EnlistedForFilter = $state(DEFAULT_ENLISTED_FOR_FILTER)
    page = $state(1)
    hasMore = $state(false)
    canLoadMore = $state(false)

    openFilters = $state(false)

    activeTab = $state<'listing' | 'create'>('listing')

    formMode = $state<FormMode>('create')
    editing: ProductRow | null = $state(null)
    submitting = $state(false)
    submitError = $state('')

    newName = $state('')
    newDescription = $state('')
    newCategory = $state('')
    newPackaging = $state('')
    newPrice = $state('')
    newCurrency = $state('PHP')
    newSizeValue = $state('')
    newSizeUnit = $state('')
    newImageUrl = $state('')
    enlistedFor = $state('')
    newEnlistedFor = $state('')
    newEnlisted = $state(true)

    sortOptions = SORT_OPTIONS
    categoryOptions = PRODUCT_CATEGORY_OPTIONS
    packagingOptions = PRODUCT_PACKAGING_OPTIONS
    enlistedForOptions = PRODUCT_ENLISTED_FOR_OPTIONS
    enlistedForFormOptions = PRODUCT_ENLISTED_FOR_OPTIONS_ALL

    hasFilters = $derived(
        this.sort !== DEFAULT_SORT ||
            this.filterCategory !== DEFAULT_CATEGORY_FILTER ||
            this.filterPackaging !== DEFAULT_PACKAGING_FILTER ||
            this.filterEnlistedFor !== DEFAULT_ENLISTED_FOR_FILTER
    )

    isCreate = $derived(this.formMode === 'create')

    deleting = $state<Set<string>>(new Set())
    pendingDelete: ProductRow | null = $state(null)
    deleteError = $state('')

    private go(
        page: number,
        patch: Partial<{
            sort: SortKey
            filterCategory: CategoryFilter
            filterPackaging: PackagingFilter
            filterEnlistedFor: EnlistedForFilter
        }>
    ) {
        const params = new URLSearchParams()
        const sort = patch.sort ?? this.sort
        const filterCategory = patch.filterCategory ?? this.filterCategory
        const filterPackaging = patch.filterPackaging ?? this.filterPackaging
        const filterEnlistedFor = patch.filterEnlistedFor ?? this.filterEnlistedFor

        if (sort && sort !== DEFAULT_SORT) params.set('sort', sort)
        if (filterCategory && filterCategory !== DEFAULT_CATEGORY_FILTER) {
            params.set('filterCategory', filterCategory)
        }
        if (filterPackaging && filterPackaging !== DEFAULT_PACKAGING_FILTER) {
            params.set('filterPackaging', filterPackaging)
        }
        if (filterEnlistedFor && filterEnlistedFor !== DEFAULT_ENLISTED_FOR_FILTER) {
            params.set('filterEnlistedFor', filterEnlistedFor)
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

    setCategoryFilter(filterCategory: CategoryFilter) {
        this.filterCategory = filterCategory
        this.go(1, {})
    }

    setPackagingFilter(filterPackaging: PackagingFilter) {
        this.filterPackaging = filterPackaging
        this.go(1, {})
    }

    setEnlistedForFilter(filterEnlistedFor: EnlistedForFilter) {
        this.filterEnlistedFor = filterEnlistedFor
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
        this.filterCategory = DEFAULT_CATEGORY_FILTER
        this.filterPackaging = DEFAULT_PACKAGING_FILTER
        this.filterEnlistedFor = DEFAULT_ENLISTED_FOR_FILTER
        this.go(1, {})
    }

    load(rows: ProductRow[], meta: ProductMeta) {
        this.products = rows
        this.meta = meta
        this.sort = meta.sort
        this.filterCategory = meta.filterCategory
        this.filterPackaging = meta.filterPackaging
        this.filterEnlistedFor = meta.filterEnlistedFor
        this.page = meta.page
        this.hasMore = meta.hasMore
        this.canLoadMore = meta.hasMore
    }

    openCreate() {
        this.formMode = 'create'
        this.editing = null
        this.newName = ''
        this.newDescription = ''
        this.newCategory = ''
        this.newPackaging = ''
        this.newPrice = ''
        this.newCurrency = 'PHP'
        this.newSizeValue = ''
        this.newSizeUnit = ''
        this.newImageUrl = ''
        this.newEnlistedFor = ''
        this.newEnlisted = true
        this.submitError = ''
        this.activeTab = 'create'
    }

    openEdit(row: ProductRow) {
        this.formMode = 'update'
        this.editing = row
        this.newName = row.name
        this.newDescription = row.description ?? ''
        this.newCategory = row.category ?? ''
        this.newPackaging = row.packaging ?? ''
        this.newPrice = String(row.price)
        this.newCurrency = row.currency
        this.newSizeValue = row.sizeValue ?? ''
        this.newSizeUnit = row.sizeUnit ?? ''
        this.newImageUrl = row.imageUrl ?? ''
        this.newEnlistedFor = row.enlistedFor ?? ''
        this.newEnlisted = row.enlisted
        this.submitError = ''
        this.activeTab = 'create'
    }

    backToListing() {
        this.activeTab = 'listing'
    }

    cancelForm() {
        this.formMode = 'create'
        this.editing = null
        this.newName = ''
        this.newDescription = ''
        this.newCategory = ''
        this.newPackaging = ''
        this.newPrice = ''
        this.newCurrency = 'PHP'
        this.newSizeValue = ''
        this.newSizeUnit = ''
        this.newImageUrl = ''
        this.newEnlistedFor = ''
        this.newEnlisted = true
        this.submitError = ''
        this.activeTab = 'listing'
    }

    async submit() {
        if (this.submitting) return

        const name = _.trim(this.newName)
        if (!name) {
            this.submitError = 'Product name is required.'
            return
        }
        if (this.newPrice === '' || Number.isNaN(Number(this.newPrice))) {
            this.submitError = 'Price is required.'
            return
        }

        const payload = {
            name,
            description: _.trim(this.newDescription) || null,
            category: this.newCategory || null,
            packaging: this.newPackaging || null,
            price: Number(this.newPrice),
            currency: this.newCurrency || 'PHP',
            sizeValue: _.trim(this.newSizeValue) || null,
            sizeUnit: _.trim(this.newSizeUnit) || null,
            imageUrl: _.trim(this.newImageUrl) || null,
            enlistedFor: this.newEnlistedFor || null,
            enlisted: this.newEnlisted
        }

        this.submitting = true
        this.submitError = ''

        try {
            if (this.formMode === 'update' && this.editing) {
                await api.post('distributor/product/update', {
                    json: { id: this.editing.id, ...payload }
                })
            } else {
                await api.post('distributor/product', { json: payload })
            }

            await invalidateAll()
            this.backToListing()
        } catch (e: any) {
            this.submitError = errorText(e, 'Something went wrong while saving the product.')
        } finally {
            this.submitting = false
        }
    }

    requestDelete(row: ProductRow) {
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
            await api.post('distributor/product/delete', { json: { id: row.id } })

            this.products = this.products.filter((item) => item.id !== row.id)
            this.pendingDelete = null
            this.deleteError = ''

            await invalidateAll()
        } catch (e: any) {
            this.deleteError = errorText(e, 'Something went wrong while deleting the product.')
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

const instance = new Products()

export default instance
