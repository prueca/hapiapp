import '$lib/db'
import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_SECRET, IGNORE_AUTH } from '$env/static/private'
import type { Handle } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import jwt, { type JwtPayload } from 'jsonwebtoken'

const LOGIN_ROUTES = ['/api/users/login', '/api/users/authorize']

/**
 * Handles access verification and serves as a middleware.
 *
 * This will resolve event for both pages and API routes
 * if access is granted.
 *
 * If access is denied, this will still resolve event for pages.
 * The redirection will be handled by the `+layout.server.ts` file.
 *
 * For API routes, this will return UNAUTHORIZED response if access is denied.
 * But only for non-login API routes.
 */

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = null
    event.locals.account = null
    event.locals.isAuthenticated = false

    if (IGNORE_AUTH === '1') {
        return resolve(event)
    }

    const isApi = event.url.pathname.startsWith('/api')
    const isLoginApi = LOGIN_ROUTES.includes(event.url.pathname)

    try {
        const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE)

        console.log({
            from: 'hooks.server.ts',
            path: event.url.pathname,
            hasAccessToken: !!accessToken
        })

        if (!accessToken) {
            const response =
                isApi && !isLoginApi
                    ? new Response(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED })
                    : await resolve(event)

            return response
        }

        type TokenPayload = JwtPayload & {
            user: AuthUser
            account: AuthAccount
        }

        const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET as string) as TokenPayload
        const isAuthenticated = payload.user !== null && payload.account !== null

        event.locals.user = payload.user
        event.locals.account = payload.account
        event.locals.isAuthenticated = isAuthenticated

        return resolve(event)
    } catch {
        const response =
            isApi && !isLoginApi
                ? new Response(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED })
                : await resolve(event)

        return response
    }
}
