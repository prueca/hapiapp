import {
    AUTHORIZATION_TOKEN_COOKIE,
    AUTHORIZATION_TOKEN_SECRET,
    ACCESS_TOKEN_COOKIE,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_VALIDITY
} from '$env/static/private'
import { json, error, isHttpError, type Cookies } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import jwt, { type SignOptions } from 'jsonwebtoken'
import moment from 'moment'
import z from 'zod'
import _ from 'lodash'

import db from '$lib/drizzle'
import { eq } from 'drizzle-orm'
import * as t from '$lib/drizzle/schema'

const schema = z.object({
    companyCode: z.string().nonempty()
})

const INVALID_AUTHORIZATION = 'Invalid user or account'

const verifyAuthToken = (cookies: Cookies) => {
    const authToken = cookies.get(AUTHORIZATION_TOKEN_COOKIE)

    if (!authToken) {
        error(StatusCodes.UNAUTHORIZED, INVALID_AUTHORIZATION)
    }

    try {
        type TokenPayload = {
            username: string
        }

        const payload = jwt.verify(authToken, AUTHORIZATION_TOKEN_SECRET as string) as TokenPayload

        return payload
    } catch {
        error(StatusCodes.UNAUTHORIZED, INVALID_AUTHORIZATION)
    }
}

const verifyAccess = async (username: string, companyCode: string) => {
    const [row] = await db
        .select()
        .from(t.access)
        .innerJoin(t.user, eq(t.user.username, username))
        .innerJoin(t.account, eq(t.account.companyCode, companyCode))
        .limit(1)

    if (!row || !row.user || !row.account) {
        error(StatusCodes.UNAUTHORIZED, INVALID_AUTHORIZATION)
    }

    return {
        user: row.user,
        account: row.account
    }
}

const authorize = (
    cookies: Cookies,
    user: typeof t.user.$inferSelect,
    account: typeof t.account.$inferSelect
) => {
    const jwtPayload = {
        user: _.pick(user, ['id', 'role', 'username', 'firstName', 'middleName', 'lastName']),
        account: _.pick(account, ['id', 'type', 'companyCode', 'name', 'type', 'address'])
    }

    const accessToken = jwt.sign(jwtPayload, ACCESS_TOKEN_SECRET as string, {
        expiresIn: ACCESS_TOKEN_VALIDITY as SignOptions['expiresIn']
    })

    const match = (ACCESS_TOKEN_VALIDITY as string).match(/^(\d+)([A-Za-z])$/)

    if (!match) {
        error(StatusCodes.INTERNAL_SERVER_ERROR, 'Invalid access token validity')
    }

    const [, amount, unit] = match as [string, moment.DurationInputArg1, moment.DurationInputArg2]

    const accessTokenExpiry = moment().add(Number(amount), unit)

    cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: accessTokenExpiry.diff(moment(), 's')
    })
}

export const POST = async ({ request, cookies }) => {
    try {
        const payload = await request.json()
        const validation = schema.safeParse(payload)

        if (!validation.success) {
            error(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
        }

        const { companyCode } = validation.data

        /**
         * Verify authorization token.
         *
         * This returns a payload containing the username.
         */

        const { username } = verifyAuthToken(cookies)

        /**
         * Verify access.
         *
         * This returns the user and account record.
         */

        const { user, account } = await verifyAccess(username, companyCode)

        /**
         * Generate access token.
         *
         * Token expires in 30 days.
         * Token is stored in an HTTP-only cookie.
         */

        authorize(cookies, user, account)

        return json({
            data: {
                user,
                account
            }
        })
    } catch (e: any) {
        if (isHttpError(e)) throw e

        const message = e.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR

        error(StatusCodes.INTERNAL_SERVER_ERROR, message)
    }
}
