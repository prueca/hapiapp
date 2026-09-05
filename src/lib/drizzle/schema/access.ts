import { pgTable, varchar, unique } from 'drizzle-orm/pg-core'
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
            .notNull()
    },
    (t) => [unique('access_user_account_unique').on(t.userId, t.accountId)]
)
