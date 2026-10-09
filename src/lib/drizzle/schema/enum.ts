import { pgEnum } from 'drizzle-orm/pg-core'
import accountTypes from '$lib/config/account.types'
import userRoles from '$lib/config/user.roles'
import {
    originStatus,
    destinationStatus,
    deploymentItemStatus
} from '$lib/config/deployment.status'
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
 * Enum for Deployment Status. Tracks the logistics state of a deployment record.
 */
export const originStatusEnum = pgEnum('origin_status', [
    originStatus.PROCESSING,
    originStatus.PENDING,
    originStatus.CANCELLED,
    originStatus.FOR_DELIVERY,
    originStatus.IN_TRANSIT,
    originStatus.DELIVERED,
    originStatus.FOR_PULLOUT,
    originStatus.SUBJECT_FOR_PULLOUT,
    originStatus.FOR_REPLACEMENT_BROKEN_UNIT,
    originStatus.FOR_REPLACEMENT_UPGRADE,
    originStatus.FOR_REPLACEMENT_DOWNGRADE
])

/**
 * Enum for Destination Status. Tracks the logistics state of a destination record.
 */
export const destinationStatusEnum = pgEnum('destination_status', [
    destinationStatus.PROCESSING,
    destinationStatus.PENDING,
    destinationStatus.CANCELLED,
    destinationStatus.TO_RECEIVE,
    destinationStatus.RECEIVED,
    destinationStatus.PULLOUT_BY_DISTRIBUTOR,
    destinationStatus.PULLOUT_BY_DEALER
])

/**
 * Enum for Deployment Item Status. Tracks the status of a deployment item
 * within the deployment process.
 */
export const deploymentItemStatusEnum = pgEnum('deployment_item_status', [
    deploymentItemStatus.HOUSED_AVAILABLE,
    deploymentItemStatus.FOR_DEPLOYMENT,
    deploymentItemStatus.DEPLOYED_DESIGNATED,
    deploymentItemStatus.PULLOUT
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
