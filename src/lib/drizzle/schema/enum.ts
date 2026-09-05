import { pgEnum } from 'drizzle-orm/pg-core'
import accountTypes from '$lib/config/account.types'
import userRoles from '$lib/config/user.roles'
import freezerStatus from '$lib/config/freezer.status'

/**
 * Enum for Account Types. Defines the specific roles permitted within the ecosystem.
 */
export const typeEnum = pgEnum('account_type', [
    accountTypes.DISTRIBUTOR,
    accountTypes.DEALER,
    accountTypes.HAPISTORE
])

/**
 * Enum for User Roles. Defines permissions levels for different user types.
 */
export const roleEnum = pgEnum('user_role', [
    userRoles.DISTRIBUTOR_ADMIN,
    userRoles.DISTRIBUTOR_USER,
    userRoles.DEALER_ADMIN,
    userRoles.DEALER_USER,
    userRoles.HAPISTORE_ADMIN,
    userRoles.HAPISTORE_USER
])

/**
 * Enum for Freezer Status. Tracks the lifecycle and current state of a freezer unit.
 */
export const freezerStatusEnum = pgEnum('freezer_status', [
    freezerStatus.HHOUSED_AVAILABLE,
    freezerStatus.FOR_DEPLOYMENT,
    freezerStatus.DEPLOYED_DESIGNATED,
    freezerStatus.FOR_PULLOUT,
    freezerStatus.PULLOUT,
    freezerStatus.FOR_REPLACEMENT_BROKEN_UNIT,
    freezerStatus.FOR_REPLACEMENT_DOWNGRADE,
    freezerStatus.FOR_REPLACEMENT_UPGRADE
])
