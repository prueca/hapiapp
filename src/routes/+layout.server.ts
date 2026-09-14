import { redirect } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'

export const load = async ({ locals, url }) => {
    if (!locals.isAuthenticated && url.pathname !== '/login') {
        return redirect(StatusCodes.SEE_OTHER, '/login')
    }

    return _.pick(locals, ['user', 'account', 'isAuthenticated'])
}
