import { freezer } from '$lib/drizzle/schema/freezer'
import { freezerStatus as freezerStatuses } from '$lib/config/freezer.options'

export type Freezer = typeof freezer.$inferSelect

export type SortKey = 'model' | 'yearModel-asc' | 'yearModel-desc' | 'createdAt-desc'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'createdAt-desc', label: 'Recently Added' },
    { value: 'model', label: 'Model (A-Z)' },
    { value: 'yearModel-asc', label: 'Year (Old to New)' },
    { value: 'yearModel-desc', label: 'Year (New to Old)' }
]

export type StatusFilter = 'all' | (typeof freezerStatuses)[keyof typeof freezerStatuses]

export const DEFAULT_STATUS_FILTER: StatusFilter = freezerStatuses.HOUSED_AVAILABLE

export const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: freezerStatuses.HOUSED_AVAILABLE, label: 'Housed — Available' },
    { value: freezerStatuses.FOR_DEPLOYMENT, label: 'For Deployment' },
    { value: freezerStatuses.DEPLOYED_DESIGNATED, label: 'Deployed — Designated' },
    { value: freezerStatuses.FOR_PULLOUT, label: 'For Pullout' },
    { value: freezerStatuses.PULLOUT, label: 'Pullout' },
    { value: freezerStatuses.FOR_REPLACEMENT_BROKEN_UNIT, label: 'For Replacement — Broken Unit' },
    { value: freezerStatuses.FOR_REPLACEMENT_DOWNGRADE, label: 'For Replacement — Downgrade' },
    { value: freezerStatuses.FOR_REPLACEMENT_UPGRADE, label: 'For Replacement — Upgrade' }
]
