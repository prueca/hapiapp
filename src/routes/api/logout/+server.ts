import { AUTHORIZATION_TOKEN_COOKIE, ACCESS_TOKEN_COOKIE } from '$env/static/private'
import { json } from '@sveltejs/kit'
import moment from 'moment'

export const POST = async ({ cookies }) => {
    cookies.set(ACCESS_TOKEN_COOKIE, '', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: moment().subtract(1, 'day').toDate()
    })

    cookies.set(AUTHORIZATION_TOKEN_COOKIE, '', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: moment().subtract(1, 'day').toDate()
    })

    return json({ success: true })
}
