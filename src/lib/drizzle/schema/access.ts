import { pgTable, varchar, unique, timestamp } from 'drizzle-orm/pg-core'
import ulid from '$lib/ulid'
import { user } from './user'
import { account } from './account'

/**
 * Association table linking users to accounts.
 * Ensures that a user can be associated with a specific account for access control.
 */
export const access = pgTable(
    'access',
    {
        id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),

        userId: varchar('user_id', { length: 26 })
            .references(() => user.id)
            .notNull(),

        accountId: varchar('account_id', { length: 26 })
            .references(() => account.id)
            .notNull(),

        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
        deletedAt: timestamp('deleted_at')
    },
    (t) => [unique('access_user_account_unique').on(t.userId, t.accountId)]
)
