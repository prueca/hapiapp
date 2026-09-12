import { pgTable, varchar, boolean, timestamp } from 'drizzle-orm/pg-core'
import { typeEnum } from './enum'
import ulid from '$lib/ulid'

/**
 * Represents an organization account.
 * Supports a recursive hierarchy (Distributor > Dealer > Franchisee).
 */
export const account = pgTable('account', {
    id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),

    type: typeEnum('type').notNull(),
    active: boolean('active').notNull().default(true),
    parentId: varchar('parent_id', { length: 26 }),

    name: varchar('name', { length: 255 }).notNull().unique(),
    address: varchar('address', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 32 }).notNull(),
    isrCode: varchar('isr_code', { length: 20 }),
    sapCode: varchar('sap_code', { length: 20 }),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at')
})
