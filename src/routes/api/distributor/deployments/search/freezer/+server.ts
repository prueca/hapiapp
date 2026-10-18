import _ from 'lodash'
import z from 'zod'
import { StatusCodes } from 'http-status-codes'
import { json, error, isHttpError } from '@sveltejs/kit'

import errors from '$lib/errors'
import userRoles from '$lib/config/user.roles'
import { deploymentItemStatus } from '$lib/config/deployment.status'

import db from '$lib/drizzle'
import { eq, and, or, isNull, getTableColumns, desc } from 'drizzle-orm'
import * as t from '$lib/drizzle/schema'

const schema = z.object({
    barcode: z.string()
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

        // Freezer status depends on the last associated
        // `deploymentItem` record.
        //
        // Other than `barcode` and `distributorId`, a freezer must meet either
        // of the following conditions:
        //
        // - `lastDeployment: null`
        // - `lastDeployment.status: housed-available`
        // - `lastDeployment.status: pullout`

        const lastDeployment = db
            .selectDistinctOn([t.deploymentItem.freezerId])
            .from(t.deploymentItem)
            .where(isNull(t.deploymentItem.deletedAt))
            .orderBy(
                t.deploymentItem.freezerId,
                desc(t.deploymentItem.createdAt),
                desc(t.deploymentItem.id)
            )
            .as('lastDeployment')

        const columns = _.omit(getTableColumns(t.freezer), ['createdAt', 'updatedAt', 'deletedAt'])

        const [freezer] = await db
            .select({
                ...columns,
                lastDeployment: {
                    id: lastDeployment.id,
                    status: lastDeployment.status
                }
            })
            .from(t.freezer)
            .leftJoin(lastDeployment, eq(lastDeployment.freezerId, t.freezer.id))
            .where(
                and(
                    eq(t.freezer.barcode, data.barcode),
                    eq(t.freezer.distributorId, authAccount.id),
                    isNull(t.freezer.deletedAt),
                    or(
                        isNull(lastDeployment.id),
                        eq(lastDeployment.status, deploymentItemStatus.HOUSED_AVAILABLE),
                        eq(lastDeployment.status, deploymentItemStatus.PULLOUT)
                    )
                )
            )
            .limit(1)

        if (!freezer) {
            error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
        }

        return json({ data: freezer })
    } catch (e: any) {
        console.log(e)
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
