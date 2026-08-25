import {
    ProductSchema,
    SORT_OPTIONS,
    type Product as ProductType,
    type SortKey
} from '$lib/types/product'
import _ from 'lodash'

class Products {
    items: ProductType[] = $state([])
    categories = $derived(['All', ..._.chain(this.items).map('category').uniq().value()])

    query = $state('')
    category = $state('All')
    sort: SortKey = $state('name')

    loading = $state(false)
    error: string | null = $state(null)

    sortOptions = SORT_OPTIONS

    filtered = $derived(
        _.chain(this.items)
            .filter((p) => (this.category === 'All' ? true : p.category === this.category))
            .filter((p) => {
                const q = _.toLower(_.trim(this.query))
                if (!q) return true
                return _.some([p.name, p.description], (f) => _.includes(_.toLower(f), q))
            })
            .sortBy('name')
            .value()
    )

    sorted = $derived(
        this.sort === 'name'
            ? this.filtered
            : _.orderBy(this.filtered, (p) => p.price, this.sort === 'price-desc' ? 'desc' : 'asc')
    )

    hasFilters = $derived(this.query !== '' || this.category !== 'All' || this.sort !== 'name')

    resetFilters() {
        this.query = ''
        this.category = 'All'
        this.sort = 'name'
    }

    async load() {
        try {
            this.loading = true
            this.error = null

            const res = await fetch('/api/products', { credentials: 'include' })
            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`)
            }

            const raw = await res.json()
            const parsed = ProductSchema.array().safeParse(raw)

            if (!parsed.success) {
                this.error = 'Received malformed product data.'
                return
            }

            this.items = parsed.data
        } catch (e: any) {
            this.error = e instanceof Error ? e.message : 'Failed to load products.'
        } finally {
            this.loading = false
        }
    }
}

export default new Products()
