import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import accountTypes from '$lib/config/account.types'
import errors from '$lib/errors'
import _ from 'lodash'
import { asc, eq, ilike, and, or, inArray, isNull } from 'drizzle-orm'

const DESIGNATION_TYPES = [accountTypes.DEALER, accountTypes.HAPISTORE]

const schema = z.object({
    query: z.string().optional(),
    type: z.enum([accountTypes.DEALER, accountTypes.HAPISTORE]).optional()
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

        const { query, type } = validation.data

        if (account.type !== accountTypes.DISTRIBUTOR) {
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
        }

        const root = await db.query.account.findFirst({
            where: eq(t.account.id, account.id),
            columns: { id: true },
            with: {
                childAccounts: {
                    columns: { id: true },
                    with: {
                        childAccounts: {
                            columns: { id: true }
                        }
                    }
                }
            }
        })

        const childIds = (root?.childAccounts ?? []).map((child) => child.id)
        const grandChildIds = (root?.childAccounts ?? []).flatMap((child) =>
            (child.childAccounts ?? []).map((grand) => grand.id)
        )

        const ids = _.uniq([...childIds, ...grandChildIds]).filter((id) => id !== account.id)

        if (!ids.length) {
            return json({ data: { items: [] } })
        }

        const q = _.trim(query)

        const items = await db
            .select()
            .from(t.account)
            .where(
                and(
                    inArray(t.account.id, ids),
                    inArray(t.account.type, DESIGNATION_TYPES),
                    q ? or(ilike(t.account.name, `%${q}%`), eq(t.account.id, q)) : undefined,
                    type ? eq(t.account.type, type) : undefined,
                    isNull(t.account.deletedAt)
                )
            )
            .orderBy(asc(t.account.createdAt), asc(t.account.name))

        return json({
            data: { items }
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
