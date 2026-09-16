import { error } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import accountTypes from '$lib/config/account.types'
import { StatusCodes } from 'http-status-codes'
import errors from '$lib/errors'
import _ from 'lodash'

export const load = async ({ locals }) => {
    if (!locals.isAuthenticated) {
        return redirect(StatusCodes.SEE_OTHER, '/login')
    }

    if (locals.account?.type !== accountTypes.DISTRIBUTOR) {
        error(StatusCodes.UNAUTHORIZED, errors.UNAUTHORIZED)
    }

    return locals
}
