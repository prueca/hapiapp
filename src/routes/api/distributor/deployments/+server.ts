import _ from 'lodash'
import z from 'zod'
import { StatusCodes } from 'http-status-codes'
import { json, error, isHttpError } from '@sveltejs/kit'
import errors from '$lib/errors'
import { originStatus } from '$lib/config/deployment.status'

import db from '$lib/drizzle'
import { eq, and, getTableColumns, gt, ilike, desc, asc } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as t from '$lib/drizzle/schema'
import userRoles from '$lib/config/user.roles.js'

const LIMIT = 12

const schema = z.object({
    sort: z
        .enum(['deploymentDate-desc', 'deploymentDate-asc', 'status-asc', 'status-desc'])
        .optional(),
    status: z
        .enum([
            originStatus.PROCESSING,
            originStatus.PENDING,
            originStatus.CANCELLED,
            originStatus.FOR_DELIVERY,
            originStatus.IN_TRANSIT,
            originStatus.DELIVERED,
            originStatus.FOR_PULLOUT,
            originStatus.SUBJECT_FOR_PULLOUT,
            originStatus.FOR_REPLACEMENT_BROKEN_UNIT,
            originStatus.FOR_REPLACEMENT_UPGRADE,
            originStatus.FOR_REPLACEMENT_DOWNGRADE
        ])
        .optional(),
    query: z.string().optional(),
    cursor: z.ulid().optional()
})

export const POST = async ({ locals, request }) => {
    try {
        const authUser = locals.user!
        const authAccount = locals.account!

        switch (authUser.role) {
            case userRoles.DISTRIBUTOR_ADMIN:
            case userRoles.DISTRIBUTOR_USER:
                // Users of these roles are allowed
                // to access this resource
                break
            default:
                // Any other roles are not allowed to perform
                // the operation.
                error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
        }

        const payload = await request.json()
        const { data, success } = schema.safeParse(payload)

        if (!success) {
            error(StatusCodes.BAD_REQUEST, errors.INVALID_DATA_FORMAT)
        }

        const origin = alias(t.account, 'origin')
        const destination = alias(t.account, 'destination')
        const deploymentItem = alias(t.deploymentItem, 'deploymentItem')
        const freezer = alias(t.freezer, 'freezer')

        const conditions = [eq(t.deployment.originId, authAccount.id)]
        let sort = [desc(t.deployment.createdAt)]

        if (data.cursor) {
            conditions.push(gt(t.deployment.id, data.cursor))
        }

        if (data.query) {
            conditions.push(ilike(destination.name, `%${data.query}%`))
        }

        if (data.status) {
            conditions.push(eq(t.deployment.originStatus, data.status))
        }

        if (data.sort) {
            switch (data.sort) {
                case 'deploymentDate-asc':
                    sort.unshift(asc(t.deployment.deploymentDate))
                    break

                case 'deploymentDate-desc':
                    sort.unshift(desc(t.deployment.deploymentDate))
                    break

                case 'status-asc':
                    sort.unshift(asc(t.deployment.originStatus))
                    break

                case 'status-desc':
                    sort.unshift(desc(t.deployment.originStatus))
                    break
            }
        }

        let items: Json[] = await db
            .select({
                ...getTableColumns(t.deployment),
                origin,
                destination,
                deploymentItem: { ...deploymentItem, freezer }
            })
            .from(t.deployment)
            .innerJoin(origin, eq(origin.id, t.deployment.originId))
            .innerJoin(destination, eq(destination.id, t.deployment.destinationId))
            .leftJoin(deploymentItem, eq(deploymentItem.deploymentId, t.deployment.id))
            .innerJoin(freezer, eq(freezer.id, deploymentItem.freezerId))
            .where(conditions.length === 1 ? conditions[0] : and(...conditions))
            .orderBy(...sort)
            .limit(LIMIT)

        /**
         * Transform items to proper shape to group deployment
         * items into array
         */

        items = _.values(_.groupBy(items, 'id')).map((rows) => ({
            ...rows[0],
            deploymentItem: undefined,
            deploymentItems: rows.map((row) => row.deploymentItem).filter(Boolean)
        }))

        const nextCursor = items.length ? _.last(items)!.id : null

        return json({
            data: { items, nextCursor }
        })
    } catch (e: any) {
        if (isHttpError(e)) throw e

        const code = _.get(e, 'cause.code', null)

        switch (code) {
            case '23505':
                error(StatusCodes.CONFLICT, errors.DATA_CONFLICT)

            case '23503':
                error(StatusCodes.UNPROCESSABLE_ENTITY, errors.FOREIGN_KEY_VIOLATION)

            case '23502':
                error(StatusCodes.BAD_REQUEST, errors.MISSING_REQUIRED_FIELD)

            case '23514':
                error(StatusCodes.UNPROCESSABLE_ENTITY, errors.CHECK_CONSTRAINT_VIOLATION)

            case '22P02':
                error(StatusCodes.BAD_REQUEST, errors.INVALID_DATA_FORMAT)
        }

        error(StatusCodes.INTERNAL_SERVER_ERROR, {
            ...errors.INTERNAL_ERROR,
            message: e.message ?? errors.INTERNAL_ERROR.message
        })
    }
}
