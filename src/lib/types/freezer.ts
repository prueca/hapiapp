import { freezer } from '$lib/drizzle/schema/freezer'

export type Freezer = typeof freezer.$inferSelect

export type SortKey = 'model' | 'yearModel-asc' | 'yearModel-desc' | 'createdAt-desc'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'createdAt-desc', label: 'Recently Added' },
    { value: 'model', label: 'Model (A-Z)' },
    { value: 'yearModel-asc', label: 'Year (Old to New)' },
    { value: 'yearModel-desc', label: 'Year (New to Old)' }
]
