import _ from 'lodash'

// deployment status values
const PROCESSING = 'processing'
const PENDING = 'pending'
const CANCELLED = 'cancelled'
const FOR_DELIVERY = 'for-delivery'
const IN_TRANSIT = 'in-transit'
const DELIVERED = 'delivered'
const TO_RECEIVE = 'to-receive'
const RECEIVED = 'received'
const SUBJECT_FOR_PULLOUT = 'subject-for-pullout'
const FOR_PULLOUT = 'for-pullout'
const FOR_REPLACEMENT_BROKEN_UNIT = 'for-replacement-broken-unit'
const FOR_REPLACEMENT_UPGRADE = 'for-replacement-upgrade'
const FOR_REPLACEMENT_DOWNGRADE = 'for-replacement-downgrade'
const PULLOUT_BY_DISTRIBUTOR = 'pullout-by-distributor'
const PULLOUT_BY_DEALER = 'pullout-by-dealer'

// deployment item status values
const HOUSED_AVAILABLE = 'housed-available'
const FOR_DEPLOYMENT = 'for-deployment'
const DEPLOYED_DESIGNATED = 'deployed-designated'
const PULLOUT = 'pullout'

export const originStatus = {
    PROCESSING,
    PENDING,
    CANCELLED,
    FOR_DELIVERY,
    IN_TRANSIT,
    DELIVERED,
    FOR_PULLOUT,
    SUBJECT_FOR_PULLOUT,
    FOR_REPLACEMENT_BROKEN_UNIT,
    FOR_REPLACEMENT_UPGRADE,
    FOR_REPLACEMENT_DOWNGRADE
} as const

export const destinationStatus = {
    PROCESSING,
    PENDING,
    CANCELLED,
    TO_RECEIVE,
    RECEIVED,
    PULLOUT_BY_DISTRIBUTOR,
    PULLOUT_BY_DEALER
} as const

export const deploymentItemStatus = {
    HOUSED_AVAILABLE,
    FOR_DEPLOYMENT,
    DEPLOYED_DESIGNATED,
    PULLOUT
}

export type OriginStatusValue = (typeof originStatus)[keyof typeof originStatus]
export type OriginStatusFilter = 'all' | OriginStatusValue

export const DEFAULT_ORIGIN_STATUS_FILTER: OriginStatusFilter = FOR_DELIVERY

export const ORIGIN_STATUS_OPTIONS: { value: OriginStatusFilter; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    ...Object.values(originStatus).map((value) => ({
        value,
        label: _.startCase(value.replace(/-/g, ' '))
    }))
]

export type DestinationStatusValue = (typeof destinationStatus)[keyof typeof destinationStatus]
export type DestinationStatusFilter = 'all' | DestinationStatusValue

export const DEFAULT_DESTINATION_STATUS_FILTER: DestinationStatusFilter = TO_RECEIVE

export const DESTINATION_STATUS_OPTIONS: { value: DestinationStatusFilter; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    ...Object.values(destinationStatus).map((value) => ({
        value,
        label: _.startCase(value.replace(/-/g, ' '))
    }))
]
