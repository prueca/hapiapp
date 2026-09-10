import api from '$lib/api'
import _ from 'lodash'
import z from 'zod'
import { goto } from '$app/navigation'
import accountTypes from '$lib/config/account.types'
import errors from '$lib/errors'

class AuthContext {
    username = $state('User1234')
    password = $state('hapi123')
    accounts = $state<AuthAccount[]>([])

    showPassword = $state(false)
    openAccountSelection = $state(false)

    error: null | string = $state(null)

    /**
     * 0 = no pending request
     * 1 = authentication
     * 2 = authorization
     */

    status: 0 | 1 | 2 = $state(0)

    togglePasswordMask() {
        this.showPassword = !this.showPassword
    }

    toggleAccountSelection() {
        this.openAccountSelection = !this.openAccountSelection

        if (!this.openAccountSelection) {
            this.status = 0
        }
    }

    async login() {
        try {
            if (this.status !== 0) return

            this.error = null

            const schema = z.object({
                username: z.string().nonempty(),
                password: z.string().nonempty()
            })

            const json = _.pick(this, ['username', 'password'])
            const parsed = schema.safeParse(json)

            if (!parsed.success) {
                this.error = 'Please enter your credentials.'
                return
            }

            this.status = 1

            const response = await api.post('users/login', { json })
            const body: Data<{ accounts: AuthAccount[] }> = await response.json()

            this.accounts = body.data.accounts

            this.toggleAccountSelection()
        } catch (e: any) {
            this.status = 0
            this.error = errors.UNEXPECTED_ERROR.message

            switch (e.name) {
                case 'HTTPError':
                    this.error = e.data.message

                    if (e.response.status === 404 && e.data?.code !== errors.NOT_FOUND.code) {
                        this.error = errors.NOT_FOUND.message
                    }

                    break

                case 'NetworkError':
                    this.error = errors.NETWORK_ERROR.message
                    break

                case 'TypeError':
                    this.error = errors.TYPE_ERROR.message
                    break
            }
        }
    }

    async authorize(accountId: string) {
        try {
            if (this.status !== 1) return

            this.status = 2
            this.error = null
            this.toggleAccountSelection()

            const json = { accountId }
            const res = await api.post('users/authorize', { json })
            const response: Data<{ user: AuthUser; account: AuthAccount }> = await res.json()
            const { account } = response.data

            switch (account.type) {
                case accountTypes.DISTRIBUTOR:
                    goto('/distributor')
                    break

                case accountTypes.DEALER:
                    goto('/dealer')
                    break

                case accountTypes.HAPISTORE:
                    goto('/hapistore')
                    break
            }
        } catch (e: any) {
            this.error = errors.UNEXPECTED_ERROR.message

            switch (e.name) {
                case 'HTTPError':
                    this.error = e.data.message

                    if (e.response.status === 404 && e.data?.code !== errors.NOT_FOUND.code) {
                        this.error = errors.NOT_FOUND.message
                    }

                    break

                case 'NetworkError':
                    this.error = errors.NETWORK_ERROR.message
                    break

                case 'TypeError':
                    this.error = errors.TYPE_ERROR.message
                    break
            }
        } finally {
            this.status = 0
        }
    }
}

export default new AuthContext()
