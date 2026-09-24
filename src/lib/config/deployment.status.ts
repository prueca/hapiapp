import _ from 'lodash'

const IN_TRANSIT = 'in-transit'
const DELIVERED = 'delivered'
const CANCELLED = 'cancelled'
const PROCESSING = 'processing'
const PENDING = 'pending'
const TO_BE_DELIVERED = 'to-be-delivered'

export const deploymentStatus = {
     IN_TRANSIT,
     DELIVERED,
     CANCELLED,
     PROCESSING,
     PENDING,
     TO_BE_DELIVERED
} as const

export type DeploymentStatusValue = (typeof deploymentStatus)[keyof typeof deploymentStatus]
export type StatusFilter = 'all' | DeploymentStatusValue

export const DEFAULT_STATUS_FILTER: StatusFilter = TO_BE_DELIVERED

export const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
     { value: 'all', label: 'All Statuses' },
     ...Object.values(deploymentStatus).map((value) => ({
          value,
          label: _.startCase(value.replace(/-/g, ' '))
     }))
]
