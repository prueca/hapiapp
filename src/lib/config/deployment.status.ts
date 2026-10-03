import _ from 'lodash'

const PROCESSING = 'processing'
const PENDING = 'pending'
const CANCELLED = 'cancelled'
const FOR_DELIVERY = 'for-delivery'
const IN_TRANSIT = 'in-transit'
const DELIVERED = 'delivered'
const RECEIVED = 'received'

export const deploymentStatus = {
     PROCESSING,
     PENDING,
     CANCELLED,
     FOR_DELIVERY,
     IN_TRANSIT,
     DELIVERED,
     RECEIVED
} as const

export type DeploymentStatusValue = (typeof deploymentStatus)[keyof typeof deploymentStatus]
export type StatusFilter = 'all' | DeploymentStatusValue

export const DEFAULT_STATUS_FILTER: StatusFilter = FOR_DELIVERY

export const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
     { value: 'all', label: 'All Statuses' },
     ...Object.values(deploymentStatus).map((value) => ({
          value,
          label: _.startCase(value.replace(/-/g, ' '))
     }))
]
