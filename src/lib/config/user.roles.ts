const DISTRIBUTOR_ADMIN = 'distributor-admin'
const DISTRIBUTOR_USER = 'distributor-user'
const DEALER_ADMIN = 'dealer-admin'
const DEALER_USER = 'dealer-user'
const HAPISTORE_ADMIN = 'hapistore-admin'
const HAPISTORE_USER = 'hapistore-user'
const DIRECT_STORE_ADMIN = 'direct-store-admin'
const DIRECT_STORE_USER = 'direct-store-user'

const userRoles = {
    DISTRIBUTOR_ADMIN,
    DISTRIBUTOR_USER,
    DEALER_ADMIN,
    DEALER_USER,
    HAPISTORE_ADMIN,
    HAPISTORE_USER,
    DIRECT_STORE_ADMIN,
    DIRECT_STORE_USER
} as const

export const displayText = {
    [DISTRIBUTOR_ADMIN]: 'Admin Distributor',
    [DISTRIBUTOR_USER]: 'Distributor',
    [DEALER_ADMIN]: 'Admin Dealer',
    [DEALER_USER]: 'Dealer',
    [HAPISTORE_ADMIN]: 'Hapistore Admin',
    [HAPISTORE_USER]: 'Hapistore User',
    [DIRECT_STORE_ADMIN]: 'Direct Store Admin',
    [DIRECT_STORE_USER]: 'Direct Store User'
}

export default userRoles
