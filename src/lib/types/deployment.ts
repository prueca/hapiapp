import { deployment, deploymentItem } from '$lib/drizzle/schema/deployment'
import { account } from '$lib/drizzle/schema/account'
import { freezer } from '$lib/drizzle/schema/freezer'
import { type StatusFilter } from '$lib/config/deployment.status'

export { type StatusFilter } from '$lib/config/deployment.status'
export { STATUS_OPTIONS, DEFAULT_STATUS_FILTER } from '$lib/config/deployment.status'

export type Deployment = typeof deployment.$inferSelect

export type DeploymentItem = typeof deploymentItem.$inferSelect

export type DeploymentItemWithFreezer = DeploymentItem & {
    freezer: (typeof freezer.$inferSelect) | null
}

export type DeploymentRow = Deployment & {
    designation: (typeof account.$inferSelect) | null
    deploymentItems: DeploymentItemWithFreezer[]
    deploymentItemCount: number
    overdue: boolean
}

export type SortKey =
     | 'deploymentDate-desc'
     | 'deploymentDate-asc'
     | 'status-asc'
     | 'status-desc'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
     { value: 'deploymentDate-desc', label: 'Deployment Date (Newest)' },
     { value: 'deploymentDate-asc', label: 'Deployment Date (Oldest)' },
     { value: 'status-desc', label: 'Status (Z-A)' },
     { value: 'status-asc', label: 'Status (A-Z)' }
]

export type DeploymentMeta = {
    sort: SortKey
    filterStatus: StatusFilter
    query: string
    page: number
    hasMore: boolean
}
