import _ from 'lodash'

const MANUAL_SUBMIT = 'manual-submit'
const MATCHED = 'matched'
const MISMATCH = 'mismatch'

export const cabconItemStatus = {
    MANUAL_SUBMIT,
    MATCHED,
    MISMATCH
} as const

export type CabconItemStatusValue = (typeof cabconItemStatus)[keyof typeof cabconItemStatus]

export const CABCON_ITEM_STATUS_OPTIONS: { value: CabconItemStatusValue; label: string }[] =
    Object.values(cabconItemStatus).map((value) => ({
        value,
        label: _.startCase(value)
    }))

const OPEN = 'open'
const CLOSED = 'closed'

export const codeMonthStatus = {
    OPEN,
    CLOSED
} as const

export type CodeMonthStatusValue = (typeof codeMonthStatus)[keyof typeof codeMonthStatus]
export type StatusFilter = 'all' | CodeMonthStatusValue

export const DEFAULT_STATUS_FILTER: StatusFilter = 'all'

export const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    ...Object.values(codeMonthStatus).map((value) => ({
        value,
        label: _.startCase(value)
    }))
]
