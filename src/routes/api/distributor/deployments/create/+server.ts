import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import moment from 'moment'
import z from 'zod'
import _ from 'lodash'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import { eq, and, or, desc, isNull, getTableColumns, inArray } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import errors from '$lib/errors'
import accountTypes from '$lib/config/account.types'
import { originStatus } from '$lib/config/deployment.status'
import { deploymentItemStatus, destinationStatus } from '$lib/config/deployment.status'

const schema = z.object({
    freezerIds: z.array(z.ulid()).nonempty(),
    destinationId: z.string().nonempty(),
    deploymentDate: z.coerce.date(),
    status: z.enum(_.values(originStatus)).optional()
})

export const POST = async ({ request, locals }) => {
    try {
        const authAccount = locals.account!

        // Check access

        if (authAccount.type !== accountTypes.DISTRIBUTOR) {
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
        }

        // Validate payload

        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            error(StatusCodes.BAD_REQUEST, errors.INVALID_DATA_FORMAT)
        }

        const { freezerIds, destinationId, deploymentDate, status } = validation.data

        // Destination account should be a descendant of the authenticated
        // distributor account.

        const parent = alias(t.account, 'parent')
        const [destinationAccount] = await db
            .select({ ...getTableColumns(t.account) })
            .from(t.account)
            .leftJoin(parent, eq(t.account.parentId, parent.id))
            .where(
                and(
                    eq(t.account.id, destinationId),
                    eq(t.account.active, true),
                    isNull(t.account.deletedAt),
                    or(eq(t.account.parentId, authAccount.id), eq(parent.parentId, authAccount.id))
                )
            )
            .limit(1)

        if (!destinationAccount) {
            error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
        }

        const result = await db.transaction(async (txn) => {
            // Insert deployment record

            const [deployment] = await txn
                .insert(t.deployment)
                .values({
                    originId: authAccount.id,
                    destinationId,
                    originStatus: status ?? originStatus.FOR_DELIVERY,
                    destinationStatus: destinationStatus.TO_RECEIVE,
                    deploymentDate
                })
                .returning()

            if (!deployment) {
                error(StatusCodes.INTERNAL_SERVER_ERROR, errors.INTERNAL_ERROR)
            }

            // The fetch query below selects freezers with its `deploymentItem`.
            //
            // It includes freezers with:
            // - `deploymentItem: null`
            // - `deploymentItem.status: housed-available`
            // - `deploymentItem.status: pullout`
            //
            // A freezer that is filtered out means it is not
            // eligible for deployment.

            const selectedFreezers = await txn
                .select({ ...getTableColumns(t.freezer), deploymentItem: t.deploymentItem })
                .from(t.freezer)
                .leftJoin(t.deploymentItem, eq(t.deploymentItem.freezerId, t.freezer.id))
                .where(
                    and(
                        eq(t.freezer.distributorId, authAccount.id),
                        isNull(t.freezer.deletedAt),
                        inArray(t.freezer.id, freezerIds),
                        or(
                            isNull(t.deploymentItem),
                            eq(t.deploymentItem.status, deploymentItemStatus.HOUSED_AVAILABLE),
                            eq(t.deploymentItem.status, deploymentItemStatus.PULLOUT)
                        )
                    )
                )
                .orderBy(desc(t.deploymentItem.createdAt))

            if (!selectedFreezers.length) {
                error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
            }

            // Insert `deploymentItem` records from `selectedFreezers`

            const deploymentItems = await txn
                .insert(t.deploymentItem)
                .values(
                    _.map(selectedFreezers, (freezer) => {
                        return {
                            freezerId: freezer.id,
                            deploymentId: deployment.id,
                            designationId: destinationAccount.id,
                            status: deploymentItemStatus.FOR_DEPLOYMENT
                        }
                    })
                )
                .returning()

            return _.assign(deployment, {
                destinationAccount,
                deploymentItems,
                deploymentDate: moment(deployment.deploymentDate).format('ddd, MMM DD YYYY')
            })
        })

        return json({ data: result })
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
