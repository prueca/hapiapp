import { pgEnum } from 'drizzle-orm/pg-core'
import accountTypes from '$lib/config/account.types'
import userRoles from '$lib/config/user.roles'
import { freezerStatus } from '$lib/config/freezer.options'
import { deploymentStatus as deploymentStatusValues } from '$lib/config/deployment.status'
import { cabconItemStatus } from '$lib/config/cabcon.options'
import { productCategory, productPackaging, productEnlistedFor } from '$lib/config/product.options'

/**
 * Enum for Account Types. Defines the specific roles permitted within the ecosystem.
 */
export const typeEnum = pgEnum('account_type', [
    accountTypes.DISTRIBUTOR,
    accountTypes.DEALER,
    accountTypes.HAPISTORE,
    accountTypes.DIRECT_STORE
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
    userRoles.HAPISTORE_USER,
    userRoles.DIRECT_STORE_ADMIN,
    userRoles.DIRECT_STORE_USER
])

/**
 * Enum for Freezer Status. Tracks the lifecycle and current state of a freezer unit.
 */
export const freezerStatusEnum = pgEnum('freezer_status', [
    freezerStatus.HOUSED_AVAILABLE,
    freezerStatus.FOR_DEPLOYMENT,
    freezerStatus.DEPLOYED_DESIGNATED,
    freezerStatus.FOR_PULLOUT,
    freezerStatus.PULLOUT,
    freezerStatus.FOR_REPLACEMENT_BROKEN_UNIT,
    freezerStatus.FOR_REPLACEMENT_DOWNGRADE,
    freezerStatus.FOR_REPLACEMENT_UPGRADE
])

/**
 * Enum for Deployment Status. Tracks the logistics state of a deployment record.
 */
export const deploymentStatus = pgEnum('deployment_status', [
     deploymentStatusValues.PROCESSING,
     deploymentStatusValues.PENDING,
     deploymentStatusValues.CANCELLED,
     deploymentStatusValues.FOR_DELIVERY,
     deploymentStatusValues.IN_TRANSIT,
     deploymentStatusValues.DELIVERED,
     deploymentStatusValues.RECEIVED
])

/**
 * Enum for Cabcon Item Status. Tracks the reconciliation state of a reported
 * freezer line item under a distributor's code of the month.
 */
export const cabconItemStatusEnum = pgEnum('cabcon_item_status', [
    cabconItemStatus.MANUAL_SUBMIT,
    cabconItemStatus.MATCHED,
    cabconItemStatus.MISMATCH
])

/**
  * Enum for Product Category. Classifies a product within the catalog.
  */
export const productCategoryEnum = pgEnum('enum_product_category', [
    productCategory.COMBINATION_PACKS,
    productCategory.LIMITED_EDITION,
    productCategory.MULTI_SERVE_TUBS,
    productCategory.PREMIUM_NOVELTIES,
    productCategory.SINGLE_SERVE_NOVELTIES,
    productCategory.SPECIALTY_TUBS
])

/**
  * Enum for Product Packaging. Describes the physical packaging of a product.
  */
export const productPackagingEnum = pgEnum('enum_product_packaging', [
    productPackaging.BOX,
    productPackaging.CONE,
    productPackaging.CUP,
    productPackaging.GALLON,
    productPackaging.PINT,
    productPackaging.STICK,
    productPackaging.TUB
])

/**
 * Enum for Product Enlisted For. Indicates the account type a product is
 * enlisted for (direct account vs. dealers).
 */
export const productEnlistedForEnum = pgEnum('enum_product_enlisted_for', [
     productEnlistedFor.FOR_DIRECT_ACCOUNT,
     productEnlistedFor.FOR_DEALERS,
     productEnlistedFor.ALL
])
