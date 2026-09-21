const IN_TRANSIT = 'in-transit'
const DELIVERED = 'delivered'
const CANCELLED = 'cancelled'
const PROCESSING = 'processing'
const PENDING = 'pending'

export const deploymentStatus = {
     IN_TRANSIT,
     DELIVERED,
     CANCELLED,
     PROCESSING,
     PENDING
} as const
