import { json } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import { freezerStatus } from '$lib/config/freezer.options'
import { and, desc, eq, inArray, isNull } from 'drizzle-orm'

const schema = z.object({
    barcode: z.string().nonempty()
})

const AVAILABLE_STATUSES = new Set<string>([freezerStatus.HOUSED_AVAILABLE, freezerStatus.PULLOUT])

export const POST = async ({ request, locals }) => {
    try {
        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            const issue = validation.error.issues[0]

            return json(
                { message: issue?.message ?? 'Invalid barcode' },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const { barcode } = validation.data
        const account = locals.account!

        const freezer = await db.query.freezer.findFirst({
            where: and(
                eq(t.freezer.barcode, barcode),
                eq(t.freezer.distributorId, account.id),
                isNull(t.freezer.deletedAt)
            ),
            with: {
                deploymentItems: {
                    columns: {
                        status: true,
                        designationId: true
                    },
                    where: (deploymentItem, { and, eq, inArray, isNull }) =>
                        and(
                            eq(deploymentItem.designationId, account.id),
                            inArray(deploymentItem.status, [
                                freezerStatus.HOUSED_AVAILABLE,
                                freezerStatus.PULLOUT
                            ]),
                            isNull(deploymentItem.deletedAt)
                        ),
                    orderBy: desc(t.deploymentItem.createdAt),
                    limit: 1
                }
            }
        })

        if (!freezer) {
            return json({
                data: { found: false, eligible: false, freezer: null, lastStatus: null }
            })
        }

        const lastItem = freezer.deploymentItems?.[0] ?? null
        const lastStatus = lastItem?.status ?? null

        const eligible =
            lastItem === null ||
            (AVAILABLE_STATUSES.has(lastItem.status) && lastItem.designationId === account.id)

        return json({
            data: { found: true, eligible, lastStatus, freezer }
        })
    } catch (e: any) {
        const source = e instanceof Error ? (e.cause instanceof Error ? e.cause : e) : e

        const message =
            source instanceof Error
                ? source.message
                : 'Something went wrong while searching for the freezer.'

        return json({ message }, { status: StatusCodes.INTERNAL_SERVER_ERROR })
    }
}
