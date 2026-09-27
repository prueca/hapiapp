import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import {
    deploymentStatus,
    DEFAULT_STATUS_FILTER,
    type StatusFilter
} from '$lib/config/deployment.status'
import { type DeploymentRow, type SortKey } from '$lib/types/deployment'
import errors from '$lib/errors'
import _ from 'lodash'
import { sql } from 'drizzle-orm'

const PAGE_SIZE = 12
const MAX_ROWS = 600

const SORT_VALUES = new Set<string>([
    'deploymentDate-desc',
    'deploymentDate-asc',
    'status-asc',
    'status-desc'
])

const STATUS_VALUES = new Set<string>(['all', ...Object.values(deploymentStatus)])

const schema = z.object({
    sort: z.string().optional(),
    filterStatus: z.string().optional(),
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional()
})

export const POST = async ({ request, locals }) => {
    try {
        const account = locals.account!

        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            return json(
                { message: errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const originId = account.id

        const resolvedSort: SortKey = SORT_VALUES.has(validation.data.sort ?? '')
            ? (validation.data.sort as SortKey)
            : 'deploymentDate-desc'

        const filterStatus: StatusFilter =
            validation.data.filterStatus && STATUS_VALUES.has(validation.data.filterStatus)
                ? (validation.data.filterStatus as StatusFilter)
                : DEFAULT_STATUS_FILTER

        const query = _.trim(validation.data.query ?? '')

        const page =
            validation.data.page &&
            Number.isFinite(validation.data.page) &&
            validation.data.page > 0
                ? Math.floor(validation.data.page)
                : 1

        const cap = Math.min(page * PAGE_SIZE, MAX_ROWS)

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
                switch (resolvedSort) {
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

        return json({
            data: {
                rows: data,
                meta: {
                    sort: resolvedSort,
                    filterStatus,
                    query,
                    page,
                    hasMore: rows.length > data.length
                }
            }
        })
    } catch (e: any) {
        if (isHttpError(e)) throw e

        const code = _.get(e, 'cause.code', null)

        switch (code) {
            case '23503':
                error(StatusCodes.UNPROCESSABLE_ENTITY, errors.FOREIGN_KEY_VIOLATION)
                break

            default:
                error(StatusCodes.INTERNAL_SERVER_ERROR, {
                    ...errors.INTERNAL_ERROR,
                    message: e.message ?? errors.INTERNAL_ERROR.message
                })
                break
        }
    }
}
