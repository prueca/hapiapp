import { error } from '@sveltejs/kit'
import userRoles from '$lib/config/user.roles'
import errors from '$lib/errors'
import { StatusCodes } from 'http-status-codes'

export const load = ({ locals }) => {
    const authUser = locals.user

    if (authUser?.role !== userRoles.DISTRIBUTOR_ADMIN) {
        // Only `distributor-admin` is allowed to access
        // this page - /distributor/accounts
        error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }
}
