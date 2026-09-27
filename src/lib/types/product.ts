import { product } from '$lib/drizzle/schema/product'
import {
    type CategoryFilter,
    type PackagingFilter,
    type EnlistedForFilter,
    PRODUCT_CATEGORY_OPTIONS,
    PRODUCT_PACKAGING_OPTIONS,
    PRODUCT_ENLISTED_FOR_OPTIONS,
    PRODUCT_ENLISTED_FOR_OPTIONS_ALL,
    DEFAULT_CATEGORY_FILTER,
    DEFAULT_PACKAGING_FILTER,
    DEFAULT_ENLISTED_FOR_FILTER
} from '$lib/config/product.options'

export {
    type CategoryFilter,
    type PackagingFilter,
    type EnlistedForFilter,
    PRODUCT_CATEGORY_OPTIONS,
    PRODUCT_PACKAGING_OPTIONS,
    PRODUCT_ENLISTED_FOR_OPTIONS,
    PRODUCT_ENLISTED_FOR_OPTIONS_ALL,
    DEFAULT_CATEGORY_FILTER,
    DEFAULT_PACKAGING_FILTER,
    DEFAULT_ENLISTED_FOR_FILTER
}

export type Product = typeof product.$inferSelect

export type ProductRow = Product

export type SortKey = 'name-asc' | 'price-asc' | 'price-desc' | 'createdAt-desc'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'createdAt-desc', label: 'Recently Added' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' }
]

export type ProductMeta = {
    sort: SortKey
    filterCategory: CategoryFilter
    filterPackaging: PackagingFilter
    filterEnlistedFor: EnlistedForFilter
    categoryOptions: string[]
    packagingOptions: string[]
    enlistedForOptions: string[]
    page: number
    hasMore: boolean
}
