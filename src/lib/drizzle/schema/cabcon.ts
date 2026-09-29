import { pgTable, varchar, date } from 'drizzle-orm/pg-core'
import ulid from '$lib/ulid'
import { account } from './account'
import { freezer } from './freezer'
import { cabconItemStatusEnum } from './enum'
import { cabconItemStatus } from '$lib/config/cabcon.options'
import { timestampMixin } from '../mixin'

/**
 * A "code of the month" record published by a distributor account. It opens a
 * reporting window (from startDate until endDate) for dealers/hapistore accounts
 * to report their freezers. Status ('open' / 'closed') is derived from endDate, not stored.
 */
export const cabcon = pgTable('cabcon', {
    id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),
    codeMonth: varchar('code_month', { length: 255 }).notNull().unique(),
    startDate: date('start_date', { mode: 'date' }).defaultNow().notNull(),
    endDate: date('end_date', { mode: 'date' }).notNull(),
    authorId: varchar('author_id', { length: 26 })
        .references(() => account.id)
        .notNull(),
    ...timestampMixin
})

/**
 * A line item within a cabcon, tracking a single freezer unit reported by a
 * reporting account (dealer / hapistore) under a distributor's code of the month.
 */
export const cabconItem = pgTable('cabcon_item', {
    id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),
    cabconId: varchar('cabcon_id', { length: 26 })
        .references(() => cabcon.id)
        .notNull(),
    accountId: varchar('account_id', { length: 26 })
        .references(() => account.id)
        .notNull(),
    freezerId: varchar('freezer_id', { length: 26 })
        .references(() => freezer.id)
        .notNull(),
    status: cabconItemStatusEnum('status').notNull().default(cabconItemStatus.MANUAL_SUBMIT),
    ...timestampMixin
})
