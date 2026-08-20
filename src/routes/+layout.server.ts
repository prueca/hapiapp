import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_SECRET, IGNORE_AUTH } from '$env/static/private'
import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import jwt, { type JwtPayload } from 'jsonwebtoken'

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    if (IGNORE_AUTH === '1') return

    if (url.pathname === '/login') return

    const accessToken = cookies.get(ACCESS_TOKEN_COOKIE)

    if (!accessToken) {
        return redirect(StatusCodes.SEE_OTHER, '/login')
    }

    try {
        type TokenPayload = JwtPayload & {
            user: User
            account: Account
        }

        const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET as string) as TokenPayload
        const isAuthenticated = payload.user !== null && payload.account !== null

        return {
            ...payload,
            isAuthenticated
        }
    } catch (e: any) {
        return redirect(StatusCodes.SEE_OTHER, '/login')
    }
}
