import { deployment } from '$lib/drizzle/schema/deployment'
import { account } from '$lib/drizzle/schema/account'
import { freezer } from '$lib/drizzle/schema/freezer'

export type Deployment = typeof deployment.$inferSelect

export type DeploymentWithRelations = Deployment & {
    origin: (typeof account.$inferSelect) | undefined
    designation: (typeof account.$inferSelect) | undefined
    freezer: (typeof freezer.$inferSelect) | undefined
}

export type GroupedFreezer = typeof freezer.$inferSelect & {
    status: string
    deploymentId: string
}

export type DeploymentGroup = {
    key: string
    designation: (typeof account.$inferSelect) | undefined
    deploymentDate: Date | null
    quantity: number
    freezers: GroupedFreezer[]
}

export type SortKey = 'deploymentDate-desc'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
     { value: 'deploymentDate-desc', label: 'Deployment Date (Newest)' }
]
