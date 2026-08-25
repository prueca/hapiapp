import api from '$lib/api'
import _ from 'lodash'
import z from 'zod'
import { goto } from '$app/navigation'
import accountTypes from '$lib/config/account.types'

type Account = {
    id: string
    type: string
    name: string
    address: string
    companyCode: string
}

class LoginState {
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

            const res = await api.post('users/login', { json })
            const response: Data<{ accounts: AuthAccount[] }> = await res.json()
            this.accounts = response.data.accounts

            this.toggleAccountSelection()
        } catch (e: any) {
            this.status = 0

            const status = _.get(e, 'response.status', null)

            switch (status) {
                case 400:
                    this.error = 'You have entered invalid credentials.'
                    break

                default:
                    this.error = _.get(e, 'data.message', 'Unknown error.')
            }
        }
    }

    async authorize(companyCode: string) {
        try {
            if (this.status !== 1) return

            this.status = 2
            this.error = null
            this.toggleAccountSelection()

            const json = { companyCode }
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

                case accountTypes.FRANCHISEE:
                    goto('/franchisee')
                    break
            }
        } catch (e: any) {
            const status = _.get(e, 'response.status', null)

            switch (status) {
                case 400:
                    this.error = 'Invalid login attempt.'
                    break

                case 404:
                    this.error = 'Resource not found.'
                    break

                default:
                    this.error = _.get(e, 'data.message', 'Unknown error.')
            }
        } finally {
            this.status = 0
        }
    }
}

export default new LoginState()
