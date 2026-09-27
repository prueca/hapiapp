import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, inArray } from 'drizzle-orm'

const schema = z.object({
    deploymentIds: z.array(z.string().nonempty()).nonempty(),
    deploymentDate: z.coerce.date()
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

        const deploymentIds = _.uniq(validation.data.deploymentIds)
        const deploymentDate = validation.data.deploymentDate

        const [matched] = await db
            .select()
            .from(t.deployment)
            .where(
                and(eq(t.deployment.originId, account.id), inArray(t.deployment.id, deploymentIds))
            )
            .limit(1)

        if (!matched) {
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
        }

        const updatedRows = await db
            .update(t.deployment)
            .set({
                deploymentDate,
                updatedAt: new Date()
            })
            .where(
                and(eq(t.deployment.originId, account.id), inArray(t.deployment.id, deploymentIds))
            )
            .returning()

        if (!updatedRows.length) {
            error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
        }

        return json({ data: { count: updatedRows.length } })
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
