import { pgTable, varchar, date, index } from 'drizzle-orm/pg-core'
import ulid from '$lib/ulid'
import { account } from './account'
import { freezer } from './freezer'
import { deploymentStatus, freezerStatusEnum } from './enum'
import { timestampMixin } from '../mixin'

/**
 * A deployment record: a shipment moved from an origin (distributor) account to a
 * designation (dealer) account. A single deployment batches many deploymentItems,
 * each tracking a freezer unit and its freezer-level status under the designation.
 */
export const deployment = pgTable(
    'deployment',
    {
        id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),
        originId: varchar('origin_id', { length: 26 })
            .references(() => account.id)
            .notNull(),
        designationId: varchar('designation_id', { length: 26 })
            .references(() => account.id)
            .notNull(),
        status: deploymentStatus('status').notNull(),
        deploymentDate: date('deployment_date', { mode: 'date' }),
        ...timestampMixin
    },
    (t) => [index('deployment_origin_status_date_idx').on(t.originId, t.status, t.deploymentDate)]
)

/**
 * A line item within a deployment, tracking a single freezer unit and its
 * current freezer-level status under a designation.
 */
export const deploymentItem = pgTable('deployment_item', {
    id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),
    deploymentId: varchar('deployment_id', { length: 26 })
        .references(() => deployment.id)
        .notNull(),
    designationId: varchar('designation_id', { length: 26 })
        .references(() => account.id)
        .notNull(),
    freezerId: varchar('freezer_id', { length: 26 })
        .references(() => freezer.id)
        .notNull(),
    status: freezerStatusEnum('status').notNull(),
    ...timestampMixin
})
