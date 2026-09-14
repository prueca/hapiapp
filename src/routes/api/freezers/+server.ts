import { json } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'

import db from '$lib/drizzle'
import * as t from '$lib/drizzle/schema'
import {
     freezerStatus,
     modelOptions,
     capacityOptions,
     yearModelOptions,
     brandOptions
} from '$lib/config/freezer.options'

const schema = z.object({
    model: z.string().nonempty(),
    capacity: z.number(),
    brand: z.string().nonempty(),
    yearModel: z.number().int().positive(),
    barcode: z.string().nonempty()
})

const ALLOWED_MODEL = new Set<string>(modelOptions as unknown as string[])

const ALLOWED_CAPACITY = new Set<number>(capacityOptions as unknown as number[])

const ALLOWED_BRAND = new Set<string>(brandOptions as unknown as string[])

const ALLOWED_YEAR_MODEL = new Set<number>(yearModelOptions as unknown as number[])

const DUPLICATE_BARCODE = 'This barcode is already in use'

const isDuplicateBarcode = (e: any): boolean => {
    const candidates = [e, e?.cause].filter(Boolean)

    for (const c of candidates) {
        if (c?.code === '23505' || c?.code === 23505) return true
        if (c?.constraint === 'freezer_barcode_unique') return true
    }

    const text = candidates
        .map((c) => `${c?.message ?? ''} ${c?.detail ?? ''}`)
        .join(' ')
        .toLowerCase()

    return text.includes('duplicate key') || text.includes('freezer_barcode_unique')
}

export const POST = async ({ request, locals }) => {
    try {
        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            const issue = validation.error.issues[0]

            return json(
                { message: issue?.message ?? 'Invalid freezer details' },
                {
                    status: StatusCodes.BAD_REQUEST
                }
            )
        }

        const { model, capacity, brand, yearModel, barcode } = validation.data

        if (!ALLOWED_MODEL.has(model)) {
            return json(
                 { message: 'Selected model is not allowed' },
                 {
                    status: StatusCodes.BAD_REQUEST
                 }
             )
        }

        if (!ALLOWED_CAPACITY.has(capacity)) {
            return json(
                 { message: 'Selected capacity is not allowed' },
                 {
                    status: StatusCodes.BAD_REQUEST
                 }
             )
        }

        if (!ALLOWED_BRAND.has(brand)) {
            return json(
                 { message: 'Selected brand is not allowed' },
                 {
                   status: StatusCodes.BAD_REQUEST
                 }
             )
         }

        if (!ALLOWED_YEAR_MODEL.has(yearModel)) {
            return json(
                 { message: 'Selected year model is not allowed' },
                 {
                   status: StatusCodes.BAD_REQUEST
                 }
             )
         }

        const account = locals.account!

        const rows = await db
            .insert(t.freezer)
            .values({
                model,
                capacity,
                unit: 'cu',
                brand,
                yearModel,
                barcode,
                status: freezerStatus.HOUSED_AVAILABLE,
                distributorId: account.id,
                designationId: account.id
            })
            .returning()

        return json({ data: { freezer: rows[0] } })
    } catch (e: any) {
        if (isDuplicateBarcode(e)) {
            return json({ message: DUPLICATE_BARCODE }, { status: StatusCodes.BAD_REQUEST })
        }

        const source = e instanceof Error ? (e.cause instanceof Error ? e.cause : e) : e

        const message =
            source instanceof Error
                ? source.message
                : 'Something went wrong while creating the freezer.'

        return json({ message }, { status: StatusCodes.INTERNAL_SERVER_ERROR })
    }
}
