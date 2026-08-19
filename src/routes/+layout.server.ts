import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, url }) => {
    if ((!locals.user || !locals.account) && url.pathname !== '/login') {
        throw redirect(303, '/login')
    }

    return {
        user: locals.user,
        account: locals.account
    }
}
