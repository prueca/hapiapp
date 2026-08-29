import z from 'zod'
import cabconStatuses from '$lib/config/cabcon.status'
import accountTypes from '$lib/config/account.types'

export const FreezerSchema = z.object({
    id: z.string(),
    model: z.string(),
    capacity: z.string().nullable(),
    barcode: z.string().nullable(),
    brand: z.string().nullable(),
    yearModel: z.number().nullable(),
    cabconStatus: z.string().nullable(),
    codeMonth: z.string().nullable(),
    cabconCreatedAt: z.string().nullable(),
    accountName: z.string().nullable(),
    accountType: z.string().nullable(),
    accountAddress: z.string().nullable()
})

export type Freezer = z.infer<typeof FreezerSchema>

export type SortKey =
    | 'model'
    | 'createdAt-desc'
    | 'yearModel-asc'
    | 'yearModel-desc'
    | 'cabconStatus'
    | 'accountName'
    | 'accountType'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'createdAt-desc', label: 'Recently Submitted' },
    { value: 'model', label: 'Model (A-Z)' },
    { value: 'yearModel-asc', label: 'Year (Old to New)' },
    { value: 'yearModel-desc', label: 'Year (New to Old)' },
    { value: 'cabconStatus', label: 'Status (A-Z)' },
    { value: 'accountName', label: 'Account (A-Z)' },
    { value: 'accountType', label: 'Type (A-Z)' }
]

export type StatusFilter = 'all' | (typeof cabconStatuses)[keyof typeof cabconStatuses]

export const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: cabconStatuses.MANUAL_SUBMIT, label: 'Manual Submit' },
    { value: cabconStatuses.MATCHED, label: 'Matched' },
    { value: cabconStatuses.MISMATCH, label: 'Mismatch' }
]

export type TypeFilter = 'all' | (typeof accountTypes)[keyof typeof accountTypes]

export const TYPE_FILTER_OPTIONS: { value: TypeFilter; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: accountTypes.DISTRIBUTOR, label: 'Distributor' },
    { value: accountTypes.DEALER, label: 'Dealer' },
    { value: accountTypes.FRANCHISEE, label: 'Franchisee' }
]

export type CodeMonthFilter = 'all' | string
