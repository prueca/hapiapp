import db from '$lib/drizzle'
import {
    DEFAULT_CATEGORY_FILTER,
    DEFAULT_PACKAGING_FILTER,
    DEFAULT_ENLISTED_FOR_FILTER,
    productCategory,
    productPackaging,
    productEnlistedFor,
    type CategoryFilter,
    type PackagingFilter,
    type EnlistedForFilter
} from '$lib/config/product.options'
import type { ProductRow, ProductMeta, SortKey } from '$lib/types/product'

const PAGE_SIZE = 12
const MAX_ROWS = 600

const SORT_KEYS = new Set<string>(['name-asc', 'price-asc', 'price-desc', 'createdAt-desc'])

const CATEGORY_VALUES = new Set<string>(['all', ...Object.values(productCategory)])
const PACKAGING_VALUES = new Set<string>(['all', ...Object.values(productPackaging)])
const ENLISTED_FOR_VALUES = new Set<string>(['all', ...Object.values(productEnlistedFor)])

export const load = async ({ locals, url }) => {
    const search = (url.searchParams.get('search') ?? '').trim()

    const rawFilterCategory = url.searchParams.get('filterCategory')
    const filterCategory: CategoryFilter =
        rawFilterCategory && CATEGORY_VALUES.has(rawFilterCategory)
            ? (rawFilterCategory as CategoryFilter)
            : DEFAULT_CATEGORY_FILTER

    const rawFilterPackaging = url.searchParams.get('filterPackaging')
    const filterPackaging: PackagingFilter =
        rawFilterPackaging && PACKAGING_VALUES.has(rawFilterPackaging)
            ? (rawFilterPackaging as PackagingFilter)
            : DEFAULT_PACKAGING_FILTER

    const rawFilterEnlistedFor = url.searchParams.get('filterEnlistedFor')
    const filterEnlistedFor: EnlistedForFilter =
        rawFilterEnlistedFor && ENLISTED_FOR_VALUES.has(rawFilterEnlistedFor)
            ? (rawFilterEnlistedFor as EnlistedForFilter)
            : DEFAULT_ENLISTED_FOR_FILTER

    const rawSort = url.searchParams.get('sort')
    const sort: SortKey = SORT_KEYS.has(rawSort ?? '') ? (rawSort as SortKey) : 'createdAt-desc'

    const rawPage = Number(url.searchParams.get('page'))
    const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1

    const cap = Math.min(page * PAGE_SIZE, MAX_ROWS)

    const query = search.toLowerCase()

    const meta: ProductMeta = {
        search,
        sort,
        filterCategory,
        filterPackaging,
        filterEnlistedFor,
        categoryOptions: [],
        packagingOptions: [],
        enlistedForOptions: [],
        page,
        hasMore: false
    }

    if (!locals.account?.id) {
        return { data: [] as ProductRow[], meta }
    }

    const rows = (await db.query.product.findMany({
        where: (product, { isNull }) => isNull(product.deletedAt),
        orderBy: (product, { desc }) => desc(product.createdAt),
        limit: MAX_ROWS + 1
    })) as unknown as ProductRow[]

    const categoryOptions = Array.from(
        new Set(rows.map((row) => row.category).filter(Boolean))
    ) as string[]
    const packagingOptions = Array.from(
        new Set(rows.map((row) => row.packaging).filter(Boolean))
    ) as string[]
    const enlistedForOptions = Array.from(
        new Set(rows.map((row) => row.enlistedFor).filter(Boolean))
    ) as string[]

    const filtered = rows.filter((row) => {
        if (
            query &&
            !(
                row.name.toLowerCase().includes(query) ||
                (row.category?.toLowerCase().includes(query) ?? false)
            )
        ) {
            return false
        }
        if (filterCategory !== 'all' && row.category !== filterCategory) return false
        if (filterPackaging !== 'all' && row.packaging !== filterPackaging) return false
        if (filterEnlistedFor !== 'all' && row.enlistedFor !== filterEnlistedFor) return false
        return true
    })

    filtered.sort((a, b) => {
        switch (sort) {
            case 'name-asc':
                return a.name.localeCompare(b.name)
            case 'price-asc':
                return Number(a.price) - Number(b.price)
            case 'price-desc':
                return Number(b.price) - Number(a.price)
            case 'createdAt-desc':
            default:
                return (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime()
        }
    })

    const data = filtered.slice(0, cap)
    meta.hasMore = filtered.length > cap
    meta.categoryOptions = categoryOptions
    meta.packagingOptions = packagingOptions
    meta.enlistedForOptions = enlistedForOptions

    return { data, meta }
}
