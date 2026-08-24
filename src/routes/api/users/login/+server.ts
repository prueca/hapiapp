import '$lib/db'
import {
    AUTHORIZATION_TOKEN_COOKIE,
    AUTHORIZATION_TOKEN_SECRET,
    AUTHORIZATION_TOKEN_VALIDITY
} from '$env/static/private'
import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import * as argon2 from 'argon2'
import jwt, { type SignOptions } from 'jsonwebtoken'
import payload from '$lib/payload'
import z from 'zod'
import _ from 'lodash'

import User from '$lib/db/User'
import Account from '$lib/db/Account'
import Access from '$lib/db/Access'

const schema = z.object({
    username: z.string().nonempty(),
    password: z.string().nonempty()
})

const INVALID_LOGIN = 'Invalid username or password'

export const POST = async ({ request, cookies }) => {
    try {
        const { username, password } = await payload(request, schema)

        /**
         * Check username validity
         */

        const user = await User.findOne({
            where: { username }
        })

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

        let accessRecords = await Access.findAll({
            where: { userId: user.id },
            include: [
                {
                    model: Account,
                    as: 'account',
                    required: true
                }
            ],
            raw: true,
            nest: true
        })

        const accounts = _.map(accessRecords, (x) => {
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
