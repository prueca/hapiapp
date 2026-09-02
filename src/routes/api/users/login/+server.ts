import {
    AUTHORIZATION_TOKEN_COOKIE,
    AUTHORIZATION_TOKEN_SECRET,
    AUTHORIZATION_TOKEN_VALIDITY
} from '$env/static/private'
import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import * as argon2 from 'argon2'
import jwt, { type SignOptions } from 'jsonwebtoken'
import z from 'zod'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq } from 'drizzle-orm'
import * as t from '$lib/drizzle/schema'

const schema = z.object({
    username: z.string().nonempty(),
    password: z.string().nonempty()
})

const INVALID_LOGIN = 'Invalid username or password'

export const POST = async ({ request, cookies }) => {
    try {
        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            error(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
        }

        const { username, password } = validation.data

        /**
         * Check username validity
         */

        const [user] = await db.select().from(t.user).where(eq(t.user.username, username)).limit(1)

        if (!user) {
            error(StatusCodes.UNAUTHORIZED, INVALID_LOGIN)
        }

        /**
         * Check password validity.
         */

        const isValidPassword = await argon2.verify(user.password, password)

        if (!isValidPassword) {
            error(StatusCodes.UNAUTHORIZED, INVALID_LOGIN)
        }

        /**
         * Generate authorization token.
         *
         * Token is stored in an HTTP-only cookie.
         * Token expires in 5 minutes.
         */

        const authToken = jwt.sign(
            {
                username: user.username
            },
            AUTHORIZATION_TOKEN_SECRET as string,
            {
                expiresIn: AUTHORIZATION_TOKEN_VALIDITY as SignOptions['expiresIn']
            }
        )

        cookies.set(AUTHORIZATION_TOKEN_COOKIE, authToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        })

        /**
         * Return all accounts accessible to the user.
         */

        const rows = await db
            .select()
            .from(t.access)
            .innerJoin(t.account, eq(t.access.accountId, t.account.id))
            .where(eq(t.access.userId, user.id))

        const accounts = _.map(rows, (x) => {
            return _.pick(x.account, ['id', 'type', 'name', 'address', 'companyCode'])
        })

        const data = { accounts }

        return json({ data })
    } catch (e: any) {
        if (isHttpError(e)) throw e

        const message = e.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR

        error(StatusCodes.INTERNAL_SERVER_ERROR, message)
    }
}
