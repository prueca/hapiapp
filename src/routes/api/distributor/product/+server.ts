import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import { productCategory, productPackaging, productEnlistedFor } from '$lib/config/product.options'
import errors from '$lib/errors'
import _ from 'lodash'

const schema = z.object({
    name: z.string().nonempty(),
    description: z.string().nullish(),
    category: z.enum(productCategory).nullish(),
    packaging: z.enum(productPackaging).nullish(),
    price: z.coerce.string(),
    currency: z.string().length(3).optional(),
    sizeValue: z.string().nullish(),
    sizeUnit: z.string().nullish(),
    imageUrl: z.string().nullish(),
    enlistedFor: z.enum(productEnlistedFor).optional(),
    enlisted: z.boolean().optional()
})

export const POST = async ({ request }) => {
    try {
        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            const issue = validation.error.issues[0]

            return json(
                { message: issue?.message ?? errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const {
            name,
            description,
            category,
            packaging,
            price,
            currency,
            sizeValue,
            sizeUnit,
            imageUrl,
            enlistedFor,
            enlisted
         } = validation.data

        const [row] = await db
             .insert(t.product)
             .values({
                name,
                description,
                category,
                packaging,
                price,
                currency: currency ?? 'PHP',
                sizeValue,
                sizeUnit,
                imageUrl,
                enlistedFor,
                enlisted: enlisted ?? true
             })
             .returning()

        if (!row) {
            error(StatusCodes.INTERNAL_SERVER_ERROR, errors.INTERNAL_ERROR)
        }

        return json({ data: row })
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
