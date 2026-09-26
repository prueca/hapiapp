import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, isNull } from 'drizzle-orm'

const schema = z.object({
    id: z.string().optional(),
    codeMonth: z.string().nonempty(),
    closeDate: z.coerce.date()
})

const DUPLICATE_CODE_MONTH = 'This code month already exists'

const isDuplicateCodeMonth = (e: any): boolean => {
    const candidates = [e, e?.cause].filter(Boolean)

    for (const c of candidates) {
        if (c?.code === '23505' || c?.code === 23505) return true
        if (c?.constraint === 'cabcon_code_month_unique') return true
    }

    const text = candidates
        .map((c) => `${c?.message ?? ''} ${c?.detail ?? ''}`)
        .join(' ')
        .toLowerCase()

    return text.includes('duplicate key') || text.includes('cabcon_code_month_unique')
}

export const POST = async ({ request, locals }) => {
    try {
        const account = locals.account!
        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            const issue = validation.error.issues[0]

            return json(
                { message: issue?.message ?? errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const { codeMonth, closeDate } = validation.data

        const [existing] = await db
            .select()
            .from(t.cabcon)
            .where(and(eq(t.cabcon.codeMonth, codeMonth), isNull(t.cabcon.deletedAt)))
            .limit(1)

        if (existing) {
            return json({ message: DUPLICATE_CODE_MONTH }, { status: StatusCodes.BAD_REQUEST })
        }

        const [row] = await db
            .insert(t.cabcon)
            .values({
                codeMonth,
                closeDate,
                authorId: account.id
            })
            .returning()

        if (!row) {
            error(StatusCodes.INTERNAL_SERVER_ERROR, errors.INTERNAL_ERROR)
        }

        return json({ data: row })
    } catch (e: any) {
        if (isHttpError(e)) throw e

        if (isDuplicateCodeMonth(e)) {
            return json({ message: DUPLICATE_CODE_MONTH }, { status: StatusCodes.BAD_REQUEST })
        }

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
