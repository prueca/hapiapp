import { pgTable, varchar, unique, integer, real } from 'drizzle-orm/pg-core'
import { freezerStatusEnum } from './enum'
import ulid from '$lib/ulid'
import { timestampMixin } from '../mixin'

/**
  * Represents a physical freezer unit.
  * Enforces a unique constraint on barcode to prevent duplicate inventory entries.
  */
export const freezer = pgTable('freezer', {
    id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),
    model: varchar('model', { length: 255 }).notNull(),
    capacity: real('capacity').notNull(),
    unit: varchar('unit', { length: 12 }).notNull(),
    brand: varchar('brand', { length: 255 }).notNull(),
    yearModel: integer('year_model').notNull(),
    barcode: varchar('barcode', { length: 255 }).unique().notNull(),
    status: freezerStatusEnum('status').notNull(),
    distributorId: varchar('distributor_id', { length: 26 }).notNull(),
    designationId: varchar('designation_id', { length: 26 }).notNull(),
    ...timestampMixin
})
