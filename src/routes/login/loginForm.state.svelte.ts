import api from '$lib/api'
import _ from 'lodash'
import z from 'zod'

type Account = {
    id: string
    type: string
    name: string
    address: string
    companyCode: string
}

class LoginForm {
    username = $state('User1234')
    password = $state('hapi123')
    accounts = $state<Account[]>([])
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
                password: z.string().nonempty()
            })

            const json = _.pick(this, ['username', 'password'])
            const parsed = schema.safeParse(json)

            if (!parsed.success) {
                this.error = 'Please enter your credentials.'
                return
            }

            const res = await api.post('users/login', { json })

            if (res.status !== 200) {
                return
            }

            type LoginResponse = {
                accounts: Account[]
            }

            const data: LoginResponse = await res.json()

            this.accounts = data.accounts
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
