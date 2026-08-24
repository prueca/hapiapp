import type { ZodObject } from 'zod'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { error } from '@sveltejs/kit'

/**
 * This extracts the payload from the request body.
 * It returns the payload or throws an error on mismatch.
 */

export default async <T extends ZodObject>(request: Request, schema: T) => {
    const payload = await request.json()
    const validation = schema.safeParse(payload)

    if (!validation.success) {
        error(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    }

    return validation.data
}
