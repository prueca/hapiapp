import api from '$lib/api'
import _ from 'lodash'
import z from 'zod'
import { goto } from '$app/navigation'

class LoginForm {
    username = $state('johndoe123')
    companyCode = $state('ID-MU')
    password = $state('easy1')

    showPassword = $state(false)

    error: null | string = $state(null)

    revealPassword() {
        this.showPassword = !this.showPassword
    }

    async submit() {
        try {
            this.error = null

            const schema = z.object({
                username: z.string().nonempty(),
                companyCode: z.string().nonempty(),
                password: z.string().nonempty()
            })

            const json = _.pick(this, ['username', 'companyCode', 'password'])
            const parsed = schema.safeParse(json)

            if (!parsed.success) {
                this.error = 'Please enter your credentials.'
                return
            }

            await api.post('users/auth', { json }).json()
            goto('/')
        } catch (e: any) {
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
}

export default new LoginForm()
