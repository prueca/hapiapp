import api from '$lib/api'
import errors from '$lib/errors'
import z from 'zod'
import _ from 'lodash'

class CreateContext {
    open = $state(false)

    loading = $state(false)

    success = $state(false)

    error: App.Error | null = $state(null)

    data = $state<{
        accountId: string | null
        firstName: string | null
        middleName: string | null
        lastName: string | null
        address: string | null
        phone: string | null
        isAdmin: boolean
    }>({
        accountId: null,
        firstName: null,
        middleName: null,
        lastName: null,
        address: null,
        phone: null,
        isAdmin: true
    })

    newUser = $state<{
        username: string
        password: string
    } | null>(null)

    issues = $state({
        accountId: null,
        firstName: null,
        middleName: null,
        lastName: null,
        isAdmin: null,
        address: null,
        phone: null
    })

    toggle(flag: boolean) {
        this.open = flag

        if (!flag) {
            this.loading = false
            this.success = false
            this.error = null
            this.newUser = null
        }
    }

    selectAccount(accountId: string) {
        this.data.accountId = accountId
    }

    validate() {
        const schema = z.object({
            accountId: z.ulid(),
            isAdmin: z.boolean(),

            firstName: z.string().nonempty(),
            middleName: z.string().nullable(),
            lastName: z.string().nullable(),

            address: z.string().nonempty(),
            phone: z.string().nonempty()
        })

        const result = schema.safeParse(this.data)

        if (!result.success && result.error) {
            _.map(result.error.issues, (x) => {
                const [field] = x.path

                if (!_.has(this.issues, field)) {
                    return
                }

                let [message] = x.message.split(':')

                switch (`${field as string}:${x.code}`) {
                    case 'firstName:invalid_value':
                    case 'firstName:too_small':
                        message = 'Please enter your first name'
                        break

                    case 'middleName:invalid_value':
                    case 'middleName:too_small':
                        message = 'Please enter your middle name'
                        break

                    case 'lastName:invald_value':
                    case 'lastName:too_small':
                        message = 'Please enter your last name'
                        break

                    case 'address:invald_value':
                    case 'address:too_small':
                        message = 'Please provide a complete address'
                        break

                    case 'phone:invald_value':
                    case 'phone:too_small':
                        message = 'Please provide a phone number'
                        break
                }

                this.issues[field] = message
            })

            return false
        }

        return true
    }

    async send() {
        if (this.loading) return

        this.open = false
        this.loading = true

        try {
            const response = await api.post('users/create', { json: this.data })
            const body = (await response.json()) as Json

            this.newUser = body.data

            this.success = true
            this.open = false
        } catch (e: any) {
            this.loading = false
            this.error = errors.UNEXPECTED_ERROR

            switch (e.name) {
                case 'HTTPError':
                    this.error = e.data

                    if (e.response.status === 404 && e.data?.code !== errors.NOT_FOUND.code) {
                        this.error = errors.NOT_FOUND
                    }

                    break

                case 'NetworkError':
                    this.error = errors.NETWORK_ERROR
                    break

                case 'TypeError':
                    this.error = errors.TYPE_ERROR
                    break
            }
        }

        _.map(_.keys(this.data), (k: keyof typeof this.data) => {
            if (k === 'isAdmin') {
                this.data[k] = true
            } else {
                this.data[k] = null
            }
        })
    }

    async submit() {
        if (!this.validate()) return

        await this.send()
    }
}

export default new CreateContext()
