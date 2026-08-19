import type { Handle } from '@sveltejs/kit'
import api from '$lib/api'

export const handle: Handle = async ({ event, resolve }) => {
    let user: User | null = null
    let account: Account | null = null

    try {
        const token = event.cookies.get('access-token')

        if (!token) {
            return resolve(event)
        }

        const res: Data<{ account: Account; user: User }> = await api
            .post('users/whoami', {
                json: {},
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .json()

        user = res.data.user
        account = res.data.account
    } catch (e: any) {
        // do nothing
    }

    event.locals.user = user
    event.locals.account = account

    return resolve(event)
}
