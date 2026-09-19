import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import { freezerStatus } from '$lib/config/freezer.options'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and } from 'drizzle-orm'

type FreezerStatus = (typeof freezerStatus)[keyof typeof freezerStatus]

const STATUS_VALUES = new Set<string>(Object.values(freezerStatus))

const schema = z.object({
    deploymentId: z.string().nonempty(),
    status: z.string().nonempty()
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

        const { deploymentId, status } = validation.data

        if (!STATUS_VALUES.has(status)) {
            return json(
                { message: errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const [deployment] = await db
            .select()
            .from(t.deployment)
            .where(and(eq(t.deployment.id, deploymentId), eq(t.deployment.originId, account.id)))
            .limit(1)

        if (!deployment) {
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
        }

        const [updated] = await db
             .update(t.deployment)
             .set({
                  status: status as FreezerStatus,
                  designationId: account.id,
                  updatedAt: new Date()
             })
             .where(eq(t.deployment.id, deploymentId))
             .returning()

        if (!updated) {
            error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
        }

        return json({ data: updated })
    } catch (e: any) {
        if (isHttpError(e)) throw e

        const code = _.get(e, 'cause.code', null)

        switch (code) {
            case '23502':
                error(StatusCodes.BAD_REQUEST, errors.MISSING_REQUIRED_FIELD)
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
