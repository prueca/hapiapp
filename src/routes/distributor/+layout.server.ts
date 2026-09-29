import { error } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import userRoles from '$lib/config/user.roles'
import { StatusCodes } from 'http-status-codes'
import errors from '$lib/errors'
import _ from 'lodash'

export const load = async ({ locals }) => {
    if (!locals.isAuthenticated) {
        return redirect(StatusCodes.SEE_OTHER, '/login')
    }

    const authUser = locals.user!

    switch (authUser.role) {
        case userRoles.DISTRIBUTOR_ADMIN:
        case userRoles.DISTRIBUTOR_USER:
            return locals
        default:
            error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }
}
