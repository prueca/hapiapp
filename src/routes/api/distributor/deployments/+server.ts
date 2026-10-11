import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import {
    originStatus,
    destinationStatus,
    DEFAULT_ORIGIN_STATUS_FILTER,
    type OriginStatusFilter,
    type DestinationStatusFilter
} from '$lib/config/deployment.status'
import {
    type DeploymentRow,
    type DeploymentMeta,
    type DeploymentSortKey
} from '$lib/types/deployment'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, isNull, desc, asc, sql, getTableColumns } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

const PAGE_SIZE = 12
const MAX_ROWS = 600

const SORT_VALUES = new Set<string>([
    'deploymentDate-desc',
    'deploymentDate-asc',
    'originStatus-asc',
    'originStatus-desc'
])

const STATUS_VALUES = new Set<string>(['all', ...Object.values(originStatus)])
const DESTINATION_STATUS_VALUES = new Set<string>(['all', ...Object.values(destinationStatus)])

const destination = alias(t.account, 'destination')

const schema = z.object({
    sort: z.string().optional(),
    filterStatus: z.string().optional(),
    filterDestinationStatus: z.string().optional(),
    overdueOnly: z.boolean().optional(),
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional()
})

// A deployment is "overdue" when it is awaiting delivery (`for-delivery`) and its
// deployment date is already in the past.
const overdueCondition = sql`
    ${t.deployment.originStatus} = ${originStatus.FOR_DELIVERY}
    AND ${t.deployment.deploymentDate} < current_date
`

const sortColumn = (sort: DeploymentSortKey) => {
    switch (sort) {
        case 'deploymentDate-asc':
            return asc(t.deployment.deploymentDate)
        case 'originStatus-asc':
            return asc(t.deployment.originStatus)
        case 'originStatus-desc':
            return desc(t.deployment.originStatus)
        case 'deploymentDate-desc':
        default:
            return desc(t.deployment.deploymentDate)
    }
}

export const POST = async ({ request, locals }) => {
    try {
        const authAccount = locals.account!

        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            return json(
                { message: errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const resolvedSort: DeploymentSortKey = SORT_VALUES.has(validation.data.sort ?? '')
            ? (validation.data.sort as DeploymentSortKey)
            : 'deploymentDate-desc'

        // Origin status defaults to the normal flow (`for-delivery`);
        // destination status defaults to `all` (no destination filter).
        const filterStatus: OriginStatusFilter =
            validation.data.filterStatus && STATUS_VALUES.has(validation.data.filterStatus)
                ? (validation.data.filterStatus as OriginStatusFilter)
                : DEFAULT_ORIGIN_STATUS_FILTER

        const filterDestinationStatus: DestinationStatusFilter =
            validation.data.filterDestinationStatus &&
            DESTINATION_STATUS_VALUES.has(validation.data.filterDestinationStatus)
                ? (validation.data.filterDestinationStatus as DestinationStatusFilter)
                : ('all' as DestinationStatusFilter)

        const overdueOnly = validation.data.overdueOnly === true
        const query = _.trim(validation.data.query ?? '')
        const page =
            validation.data.page &&
            Number.isFinite(validation.data.page) &&
            validation.data.page > 0
                ? Math.floor(validation.data.page)
                : 1

        const cap = Math.min(page * PAGE_SIZE, MAX_ROWS)
        const likePattern = `%${query}%`
        const hasQuery = query.length > 0

        const rows = await db
            .select({
                ...getTableColumns(t.deployment),
                destinationName: destination.name,
                destinationAddress: destination.address,
                destinationType: destination.type,
                overdue: sql<boolean>`${overdueCondition}`.as('overdue'),
                deploymentItemCount: sql<number>`(
                    select count(*)
                    from deployment_item
                    where deployment_id = ${t.deployment.id}
                      and deleted_at is null
                )`.as('deployment_item_count')
            })
            .from(t.deployment)
            .leftJoin(destination, eq(destination.id, t.deployment.destinationId))
            .where(
                and(
                    isNull(t.deployment.deletedAt),
                    eq(t.deployment.originId, authAccount.id),
                    filterStatus !== 'all'
                        ? eq(t.deployment.originStatus, filterStatus)
                        : undefined,
                    filterDestinationStatus !== 'all'
                        ? eq(t.deployment.destinationStatus, filterDestinationStatus)
                        : undefined,
                    overdueOnly ? overdueCondition : undefined,
                    hasQuery
                        ? sql`
                            EXISTS (
                                SELECT 1
                                FROM account
                                WHERE account.id = ${t.deployment.destinationId}
                                  AND (account.name ILIKE ${likePattern}
                                        OR account.address ILIKE ${likePattern})
                            )
                        `
                        : undefined
                )
            )
            .orderBy(sortColumn(resolvedSort))
            .limit(cap + 1)

        const data = rows.slice(0, cap) as unknown as DeploymentRow[]

        const meta: DeploymentMeta = {
            sort: resolvedSort,
            filterStatus,
            filterDestinationStatus,
            overdueOnly,
            query,
            page,
            hasMore: rows.length > cap
        }

        return json({ data: { rows: data, meta } })
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
