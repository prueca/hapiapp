import { pgTable, varchar, date, index } from 'drizzle-orm/pg-core'
import ulid from '$lib/ulid'
import { account } from './account'
import { freezer } from './freezer'
import { originStatusEnum, destinationStatusEnum, deploymentItemStatusEnum } from './enum'
import { timestampMixin } from '../mixin'

/**
 * A deployment shipment moved from an origin (distributor) account to a destination
 * (dealer / direct-store) account, tracked from two perspectives: `originStatus`
 * (the origin's view) and `destinationStatus` (the destination's view). A single
 * deployment batches many `deploymentItem` rows, each tracking one freezer unit and its
 * freezer-level status under a designation.
 */
export const deployment = pgTable(
    'deployment',
    {
        id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),
        originId: varchar('origin_id', { length: 26 })
            .references(() => account.id)
            .notNull(),
        originStatus: originStatusEnum('origin_status').notNull(),
        destinationId: varchar('destination_id', { length: 26 })
            .references(() => account.id)
            .notNull(),
        destinationStatus: destinationStatusEnum('destination_status').notNull(),
        deploymentDate: date('deployment_date', { mode: 'date' }),
        ...timestampMixin
    },
    (t) => [
        index('deployment_origin_status_date_idx').on(t.originId, t.originStatus, t.deploymentDate)
    ]
)

/**
 * A line item within a deployment, tracking a single freezer unit (via `freezerId`) and
 * its current freezer-level status under a designation account.
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
    status: deploymentItemStatusEnum('status').notNull(),
    ...timestampMixin
})
