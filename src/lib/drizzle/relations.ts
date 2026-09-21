import { relations } from 'drizzle-orm'
import { account, user, freezer, deployment, deploymentItem } from './schema'

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
        references: [account.id],
        relationName: 'freezer_distributor'
    }),
    deploymentItems: many(deploymentItem, {
        relationName: 'deployment_item_freezer'
     })
}))

export const deploymentRelations = relations(deployment, ({ one, many }) => ({
    origin: one(account, {
        fields: [deployment.originId],
        references: [account.id],
        relationName: 'deployment_origin'
    }),
    designation: one(account, {
        fields: [deployment.designationId],
        references: [account.id],
        relationName: 'deployment_designation'
    }),
    deploymentItems: many(deploymentItem, {
        relationName: 'deployment_item'
    })
}))

export const deploymentItemRelations = relations(deploymentItem, ({ one }) => ({
    deployment: one(deployment, {
        fields: [deploymentItem.deploymentId],
        references: [deployment.id],
        relationName: 'deployment_item'
    }),
    designation: one(account, {
        fields: [deploymentItem.designationId],
        references: [account.id],
        relationName: 'deployment_item_designation'
    }),
    freezer: one(freezer, {
        fields: [deploymentItem.freezerId],
        references: [freezer.id],
        relationName: 'deployment_item_freezer'
    })
}))
