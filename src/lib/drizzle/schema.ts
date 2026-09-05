import { pgTable, varchar, pgEnum, boolean, unique, integer, real } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import ulid from '$lib/ulid'
import accountTypes from '$lib/config/account.types'
import userRoles from '$lib/config/user.roles'
import freezerStatus from '$lib/config/freezer.status'
import { timestampMixin } from './mixin'

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

/**
 * Represents an organization account.
 * Supports a recursive hierarchy (Distributor > Dealer > Franchisee).
 */
export const account = pgTable('account', {
    id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),

    type: typeEnum('type').notNull(),
    active: boolean('active').notNull().default(true),
    parentId: varchar('parent_id', { length: 26 }),

    name: varchar('name', { length: 255 }).notNull(),
    address: varchar('address', { length: 255 }),
    phone: varchar('phone', { length: 32 }),
    isrCode: varchar('isr_code', { length: 20 }),
    sapCode: varchar('sap_code', { length: 20 }),
    companyCode: varchar('company_code', { length: 20 }).unique().notNull()
})

/**
 * Represents a system user.
 * Contains identity and authentication details.
 */
export const user = pgTable('user', {
    id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),

    role: roleEnum('role').notNull(),
    active: boolean('active').notNull().default(true),

    firstName: varchar('first_name', { length: 255 }).notNull(),
    middleName: varchar('middle_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    address: varchar('address', { length: 255 }),
    phone: varchar('phone', { length: 32 }),

    username: varchar('username', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull()
})

/**
 * Association table linking users to accounts.
 * Ensures that a user can be associated with a specific account for access control.
 */
export const access = pgTable(
    'access',
    {
        id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),

        userId: varchar('user_id', { length: 26 })
            .references(() => user.id)
            .notNull(),

        accountId: varchar('account_id', { length: 26 })
            .references(() => account.id)
            .notNull()
    },
    (t) => [unique('access_user_account_unique').on(t.userId, t.accountId)]
)

/**
 * Represents a physical freezer unit.
 * Includes unique constraints on brand, capacity, and year model to enforce strict inventory rules.
 */
export const freezer = pgTable('freezer', {
    id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),
    model: varchar('model', { length: 255 }).unique().notNull(),
    capacity: real('capacity').unique().notNull(),
    unit: varchar('unit', { length: 12 }).unique().notNull(),
    brand: varchar('brand', { length: 255 }).unique().notNull(),
    yearModel: integer('year_model').unique().notNull(),
    barcode: varchar('barcode', { length: 255 }).unique().notNull(),
    status: freezerStatusEnum('status').notNull(),
    distributorId: varchar('distributor_id', { length: 26 }).notNull(),
    designationId: varchar('designation_id', { length: 26 }).notNull(),
    ...timestampMixin
})
