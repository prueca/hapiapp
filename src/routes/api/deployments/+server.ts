import _ from 'lodash'
import z from 'zod'
import { StatusCodes } from 'http-status-codes'
import { json, error, isHttpError } from '@sveltejs/kit'
import errors from '$lib/errors'
import { originStatus } from '$lib/config/deployment.status'
import accountTypes from '$lib/config/account.types'

type Handler = (data: Json) => Promise<{ items: Json[]; nextCursor: string }>

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
        const payload = await request.json()
        const { data, success } = schema.safeParse(payload)

        if (!success) {
            error(StatusCodes.BAD_REQUEST, errors.INVALID_DATA_FORMAT)
        }

        const authAccount = locals.account!
        let handler: Handler

        switch (authAccount.type) {
            case accountTypes.DISTRIBUTOR:
                handler = (await import('./distributor')).default
                break

            default:
                error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
        }

        const result = await handler({ ...data, authAccount })

        return json(result)
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
