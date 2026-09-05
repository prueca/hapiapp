import { pgTable, varchar, unique, integer, real } from 'drizzle-orm/pg-core'
import { freezerStatusEnum } from './enum'
import ulid from '$lib/ulid'
import { timestampMixin } from '../mixin'

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
