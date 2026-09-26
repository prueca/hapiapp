import db from '$lib/drizzle'
import { deploymentStatus, DEFAULT_STATUS_FILTER, type StatusFilter } from '$lib/config/deployment.status'
import { sql, eq, and, desc, asc } from 'drizzle-orm'
import type { DeploymentRow, DeploymentMeta, SortKey } from '$lib/types/deployment'

const PAGE_SIZE = 12
const MAX_ROWS = 600

const SORT_KEYS = new Set<string>([
     'deploymentDate-desc',
     'deploymentDate-asc',
     'status-asc',
     'status-desc'
])

const STATUS_VALUES = new Set<string>(['all', ...Object.values(deploymentStatus)])

export const load = async ({ locals, url }) => {
     const originId = locals.account?.id

     const query = (url.searchParams.get('query') ?? '').trim()

     const rawFilter = url.searchParams.get('filterStatus')
     const filterStatus: StatusFilter =
          rawFilter && STATUS_VALUES.has(rawFilter) ? (rawFilter as StatusFilter) : DEFAULT_STATUS_FILTER

     const rawSort = url.searchParams.get('sort')
     const sort: SortKey = SORT_KEYS.has(rawSort ?? '') ? (rawSort as SortKey) : 'deploymentDate-desc'

     const rawPage = Number(url.searchParams.get('page'))
     const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1

     const cap = Math.min(page * PAGE_SIZE, MAX_ROWS)

     const meta: DeploymentMeta = {
          sort,
          filterStatus,
          query,
          page,
          hasMore: false
     }

     if (!originId) {
          return { data: [] as DeploymentRow[], meta }
     }

     const likePattern = `%${query}%`

     const rows = await db.query.deployment.findMany({
          where: (deployment, { and, eq }) =>
               and(
                    eq(deployment.originId, originId),
                    filterStatus !== 'all' ? eq(deployment.status, filterStatus) : undefined,
                    query
                         ? sql`EXISTS (
                                  SELECT 1
                                  FROM account
                                  WHERE account.id = ${deployment.designationId}
                                        AND (account.name ILIKE ${likePattern}
                                              OR account.address ILIKE ${likePattern})
                          )`
                         : undefined
               ),
          with: {
               designation: true,
               deploymentItems: {
                    with: {
                         freezer: true
                    },
                    where: (deploymentItem, { and, eq, isNull }) =>
                         and(
                              eq(deploymentItem.status, 'for deployment'),
                              isNull(deploymentItem.deletedAt)
                         ),
                    orderBy: (deploymentItem, { desc }) => desc(deploymentItem.createdAt)
               }
          },
          orderBy: (deployment, { desc, asc }) => {
               switch (sort) {
                    case 'deploymentDate-asc':
                         return asc(deployment.deploymentDate)
                    case 'status-asc':
                         return asc(deployment.status)
                    case 'status-desc':
                         return desc(deployment.status)
                    case 'deploymentDate-desc':
                    default:
                         return desc(deployment.deploymentDate)
               }
          },
          extras: {
               deploymentItemCount:
                    sql`(select count(*) from "deployment_item" where "deployment_item"."deployment_id" = "deployment"."id" and "deployment_item"."status" = 'for deployment' and "deployment_item"."deleted_at" is null)`.as(
                         'deployment_item_count'
                    ),
               overdue:
                    sql`case when "deployment"."status" = 'to-be-delivered' and "deployment"."deployment_date" < current_date then true else false end`.as(
                         'overdue'
                    )
          },
          limit: cap + 1
     })

     const data = rows.slice(0, cap) as DeploymentRow[]
     meta.hasMore = rows.length > data.length

     return { data, meta }
}
