import { pgTable, varchar, date } from 'drizzle-orm/pg-core'
import ulid from '$lib/ulid'
import { account } from './account'
import { freezer } from './freezer'
import { freezerStatusEnum } from './enum'
import { timestampMixin } from '../mixin'

/**
 * A deployment record: a single freezer moved from an origin account to a
 * designation (dealer) account. A freezer can have many deployments over time.
 */
export const deployment = pgTable('deployment', {
    id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),
    originId: varchar('origin_id', { length: 26 })
        .references(() => account.id)
        .notNull(),
    designationId: varchar('designation_id', { length: 26 })
        .references(() => account.id)
        .notNull(),
    freezerId: varchar('freezer_id', { length: 26 })
        .references(() => freezer.id)
        .notNull(),
    status: freezerStatusEnum('status').notNull(),
    deploymentDate: date('deployment_date', { mode: 'date' }),
    ...timestampMixin
})
