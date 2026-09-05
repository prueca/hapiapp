import { pgTable, varchar, boolean } from 'drizzle-orm/pg-core'
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

    name: varchar('name', { length: 255 }).notNull(),
    address: varchar('address', { length: 255 }),
    phone: varchar('phone', { length: 32 }),
    isrCode: varchar('isr_code', { length: 20 }),
    sapCode: varchar('sap_code', { length: 20 }),
    companyCode: varchar('company_code', { length: 20 }).unique().notNull()
})
