import { relations } from 'drizzle-orm'
import { account, user, freezer, deployment } from './schema'

export const accountRelation = relations(account, ({ one, many }) => ({
    users: many(user),
    freezers: many(freezer),

    // The "Many" side: Downward tree lookup
    // If this is a Distributor, 'children' returns its Dealers.
    // If this is a Dealer, 'children' returns its Franchisees.
    childAccounts: many(account, { relationName: 'account_heirarchy' }),

    // The "One" side: Upward tree lookup
    // If this is a Franchisee, 'parent' returns its Dealer.
    // If this is a Dealer, 'parent' returns its Distributor.
    parentAccount: one(account, {
        fields: [account.parentId],
        references: [account.id],
        relationName: 'account_heirarchy'
    })
}))

export const freezerRelations = relations(freezer, ({ one, many }) => ({
    distributor: one(account, {
        fields: [freezer.distributorId],
        references: [account.id]
      }),
    deployments: many(deployment)
}))

export const deploymentRelations = relations(deployment, ({ one }) => ({
    origin: one(account, {
        fields: [deployment.originId],
        references: [account.id]
      }),
    designation: one(account, {
        fields: [deployment.designationId],
        references: [account.id]
      }),
    freezer: one(freezer, {
        fields: [deployment.freezerId],
        references: [freezer.id]
      })
}))
