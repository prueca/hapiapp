import { error } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import accountTypes from '$lib/config/account.types'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import _ from 'lodash'

export const load = async ({ locals }) => {
    console.log({
        from: 'distributor/+layout.server.ts',
        locals
    })

    if (!locals.isAuthenticated) {
        return redirect(StatusCodes.SEE_OTHER, '/login')
    }

    if (locals.account?.type !== accountTypes.DISTRIBUTOR) {
        throw error(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    }

    return locals
}
