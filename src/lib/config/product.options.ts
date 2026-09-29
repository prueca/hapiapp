const COMBINATION_PACKS = 'Combination Packs'
const LIMITED_EDITION = 'Limited Edition'
const MULTI_SERVE_TUBS = 'Multi-Serve Tubs'
const PREMIUM_NOVELTIES = 'Premium Novelties'
const SINGLE_SERVE_NOVELTIES = 'Single-Serve Novelties'
const SPECIALTY_TUBS = 'Specialty Tubs'

export const productCategory = {
    COMBINATION_PACKS,
    LIMITED_EDITION,
    MULTI_SERVE_TUBS,
    PREMIUM_NOVELTIES,
    SINGLE_SERVE_NOVELTIES,
    SPECIALTY_TUBS
} as const

const BOX = 'Box'
const CONE = 'Cone'
const CUP = 'Cup'
const GALLON = 'Gallon'
const PINT = 'Pint'
const STICK = 'Stick'
const TUB = 'Tub'

export const productPackaging = {
    BOX,
    CONE,
    CUP,
    GALLON,
    PINT,
    STICK,
    TUB
} as const

const FOR_DIRECT_ACCOUNT = 'for direct account'
const FOR_DEALERS = 'for dealers'
const ALL = 'all'

export const productEnlistedFor = {
    FOR_DIRECT_ACCOUNT,
    FOR_DEALERS,
    ALL
} as const

export type ProductCategoryValue = (typeof productCategory)[keyof typeof productCategory]
export type ProductPackagingValue = (typeof productPackaging)[keyof typeof productPackaging]
export type ProductEnlistedForValue = (typeof productEnlistedFor)[keyof typeof productEnlistedFor]

export type CategoryFilter = 'all' | ProductCategoryValue
export type PackagingFilter = 'all' | ProductPackagingValue
export type EnlistedForFilter = 'all' | ProductEnlistedForValue

export const DEFAULT_CATEGORY_FILTER: CategoryFilter = 'all'
export const DEFAULT_PACKAGING_FILTER: PackagingFilter = 'all'
export const DEFAULT_ENLISTED_FOR_FILTER: EnlistedForFilter = 'all'

export const PRODUCT_CATEGORY_OPTIONS: { value: ProductCategoryValue; label: string }[] =
    Object.values(productCategory).map((value) => ({ value, label: value }))

export const PRODUCT_PACKAGING_OPTIONS: { value: ProductPackagingValue; label: string }[] =
    Object.values(productPackaging).map((value) => ({ value, label: value }))

export const PRODUCT_ENLISTED_FOR_OPTIONS: {
    value: ProductEnlistedForValue
    label: string
}[] = Object.values(productEnlistedFor)
    .filter((value) => value !== 'all')
    .map((value) => ({ value, label: value }))

export const PRODUCT_ENLISTED_FOR_OPTIONS_ALL: {
    value: ProductEnlistedForValue
    label: string
}[] = Object.values(productEnlistedFor).map((value) => ({ value, label: value }))
