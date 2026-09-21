import { deployment, deploymentItem } from '$lib/drizzle/schema/deployment'
import { account } from '$lib/drizzle/schema/account'
import { freezer } from '$lib/drizzle/schema/freezer'

export type Deployment = typeof deployment.$inferSelect

export type DeploymentItem = typeof deploymentItem.$inferSelect

export type DeploymentItemWithFreezer = DeploymentItem & {
    freezer: (typeof freezer.$inferSelect) | null
}

export type DeploymentRow = Deployment & {
    designation: (typeof account.$inferSelect) | null
    deploymentItems: DeploymentItemWithFreezer[]
    deploymentItemCount: number
}

export type SortKey = 'deploymentDate-desc'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'deploymentDate-desc', label: 'Deployment Date (Newest)' }
]
