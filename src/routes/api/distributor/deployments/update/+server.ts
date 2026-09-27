import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import { freezerStatus } from '$lib/config/freezer.options'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, desc, isNull } from 'drizzle-orm'

const schema = z.object({
    deploymentId: z.string().nonempty(),
    designationId: z.string().optional(),
    freezerIds: z.array(z.string().nonempty()),
    deploymentDate: z.coerce.date()
})

const AVAILABLE_STATUSES = new Set<string>([freezerStatus.HOUSED_AVAILABLE, freezerStatus.PULLOUT])

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

        const { deploymentId, designationId, freezerIds, deploymentDate } = validation.data

        const result = await db.transaction(async (txn) => {
            const [parent] = await txn
                  .select()
                  .from(t.deployment)
                  .where(and(eq(t.deployment.id, deploymentId), eq(t.deployment.originId, account.id)))
                  .limit(1)

            if (!parent) {
                error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
             }

            const designation = designationId ?? parent.designationId

            const [updated] = await txn
                  .update(t.deployment)
                  .set({ designationId: designation, deploymentDate, updatedAt: new Date() })
                  .where(eq(t.deployment.id, deploymentId))
                  .returning()

            if (!updated) {
                error(StatusCodes.NOT_FOUND, errors.NOT_FOUND)
             }

            const remaining = await txn
                   .select()
                   .from(t.deploymentItem)
                   .where(
                       and(
                           eq(t.deploymentItem.deploymentId, parent.id),
                           isNull(t.deploymentItem.deletedAt)
                         )
                   )

            const liveByFreezer = new Map(remaining.map((item) => [item.freezerId, item]))

            const targetFreezerIds = new Set(_.uniq(freezerIds))

            for (const item of remaining) {
                if (!targetFreezerIds.has(item.freezerId)) {
                    await txn.delete(t.deploymentItem).where(eq(t.deploymentItem.id, item.id))
                   }
              }

            const items: (typeof t.deploymentItem.$inferSelect)[] = []

            for (const freezerId of targetFreezerIds) {
                if (liveByFreezer.has(freezerId)) continue

                const [freezer] = await txn
                        .select()
                        .from(t.freezer)
                        .where(
                           and(
                               eq(t.freezer.id, freezerId),
                               eq(t.freezer.distributorId, account.id),
                               isNull(t.freezer.deletedAt)
                             )
                        )
                        .limit(1)

                if (!freezer) continue

                const [lastItem] = await txn
                        .select()
                        .from(t.deploymentItem)
                        .where(
                           and(
                               eq(t.deploymentItem.freezerId, freezer.id),
                               isNull(t.deploymentItem.deletedAt)
                             )
                        )
                        .orderBy(desc(t.deploymentItem.createdAt))
                        .limit(1)

                const eligible =
                    lastItem === undefined ||
                     (AVAILABLE_STATUSES.has(lastItem.status) && lastItem.designationId === account.id)

                if (!eligible) continue

                const [item] = await txn
                        .insert(t.deploymentItem)
                        .values({
                           deploymentId: parent.id,
                           designationId: designation,
                           freezerId: freezer.id,
                           status: freezerStatus.FOR_DEPLOYMENT
                        })
                        .returning()

                items.push(item)
              }

            return { deployment: updated, items }
        })

        return json({
            data: {
                deployment: result.deployment,
                items: result.items,
                count: result.items.length
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
