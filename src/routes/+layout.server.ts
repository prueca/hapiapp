import { IGNORE_AUTH } from '$env/static/private'
import { redirect } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'

export const load = async ({ locals, url }) => {
    if (IGNORE_AUTH === '1') {
        return _.pick(locals, ['user', 'account', 'isAuthenticated'])
    }

    if (!locals.isAuthenticated && url.pathname !== '/login') {
        return redirect(StatusCodes.SEE_OTHER, '/login')
    }

    return _.pick(locals, ['user', 'account', 'isAuthenticated'])
}
