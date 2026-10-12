import _ from 'lodash'
import z from 'zod'
import { StatusCodes } from 'http-status-codes'
import { json, error, isHttpError } from '@sveltejs/kit'

import errors from '$lib/errors'
import userRoles from '$lib/config/user.roles'

import db from '$lib/drizzle'
import { eq, and, getTableColumns } from 'drizzle-orm'
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

        const columns = _.omit(getTableColumns(t.freezer), ['createdAt', 'updatedAt', 'deletedAt'])

        const [freezer] = await db
            .select(columns)
            .from(t.freezer)
            .where(
                and(
                    eq(t.freezer.distributorId, authAccount.id),
                    eq(t.freezer.barcode, data.barcode)
                )
            )
            .limit(1)

        if (!freezer) {
            error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
        }

        return json({ data: freezer })
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
