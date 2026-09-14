import { pgTable, varchar, boolean, timestamp } from 'drizzle-orm/pg-core'
import { roleEnum } from './enum'
import ulid from '$lib/ulid'

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
    address: varchar('address', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 32 }).notNull(),

    username: varchar('username', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at')
})
