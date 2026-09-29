import { pgTable, varchar, numeric, boolean } from 'drizzle-orm/pg-core'
import ulid from '$lib/ulid'
import { productCategoryEnum, productPackagingEnum, productEnlistedForEnum } from './enum'
import { timestampMixin } from '../mixin'

/**
 * Represents a product in the catalog.
 * Category and packaging are constrained by their respective enums; price is
 * denominated in Philippine Peso (currency defaults to 'PHP').
 */
export const product = pgTable('product', {
    id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),

    name: varchar('name', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }),

    category: productCategoryEnum('category'),
    packaging: productPackagingEnum('packaging'),

    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('PHP'),

    sizeValue: varchar('size_value', { length: 20 }),
    sizeUnit: varchar('size_unit', { length: 20 }),

    imageUrl: varchar('image_url', { length: 255 }),

    enlistedFor: productEnlistedForEnum('enlisted_for').notNull().default('for dealers'),
    enlisted: boolean('enlisted').notNull().default(true),

    ...timestampMixin
})
