const DISTRIBUTOR = 'distributor'
const DEALER = 'dealer'
const HAPISTORE = 'hapistore'
const DIRECT_STORE = 'direct_store'

const accountTypes = {
    DISTRIBUTOR,
    DEALER,
    HAPISTORE,
    DIRECT_STORE
} as const

export const displayText = {
    [DISTRIBUTOR]: 'Distributor',
    [DEALER]: 'Dealer',
    [HAPISTORE]: 'Hapistore',
    [DIRECT_STORE]: 'Direct Store'
}

export default accountTypes
