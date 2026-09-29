import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and } from 'drizzle-orm'

const schema = z.object({
    deploymentId: z.string().nonempty()
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

        const { deploymentId } = validation.data

        const [deployment] = await db
             .select()
             .from(t.deployment)
             .where(and(eq(t.deployment.id, deploymentId), eq(t.deployment.originId, account.id)))
             .limit(1)

        if (!deployment) {
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
         }

        await db.transaction(async (txn) => {
            await txn.delete(t.deploymentItem).where(eq(t.deploymentItem.deploymentId, deploymentId))
            await txn.delete(t.deployment).where(eq(t.deployment.id, deploymentId))
        })

        return json({ data: { deleted: true, deploymentId } })
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
