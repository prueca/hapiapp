import _ from 'lodash'
import api from '$lib/api'
import errors from '$lib/errors'
import accounts from './accounts.context.svelte'
import z from 'zod'
import accountTypes from '$lib/config/account.types'

class UpdateContext {
    open = $state(false)

    loading = $state(false)
    success = $state(false)
    error: App.Error | null = $state(null)

    data = $state({
        id: '',
        type: '',
        name: '',
        address: '',
        phone: '',
        isrCode: null,
        sapCode: null
    })

    issues = $state({
        type: null,
        name: null,
        address: null,
        phone: null,
        isrCode: null,
        sapCode: null
    })

    setOpen(flag: boolean) {
        if (!this.open) {
            this.error = null
        }

        if (!flag) {
            this.success = false
        }

        this.open = flag
    }

    select(id: string) {
        const account = _.find(accounts.list, (x) => x.id === id)!

        this.data = _.pick(account, [
            'id',
            'type',
            'name',
            'address',
            'phone',
            'isrCode',
            'sapCode'
        ]) as typeof this.data

        this.setOpen(true)
    }

    validate() {
        const schema = z.object({
            type: z.enum([accountTypes.DEALER, accountTypes.HAPISTORE]),
            name: z.string().nonempty(),
            address: z.string().nonempty(),
            phone: z
                .string()
                .regex(/^09\d{9}$/)
                .nonempty(),
            isrCode: z
                .string()
                .regex(/^[A-Z0-9]{10,20}$/)
                .nonempty()
                .nullable(),
            sapCode: z
                .string()
                .regex(/^[A-Z0-9]{10,20}$/)
                .nonempty()
                .nullable()
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
                    case 'type:invalid_value':
                        message = 'Please select an account type'
                        break

                    case 'name:too_small':
                        message = 'Please provide an account name'
                        break

                    case 'address:too_small':
                        message = 'Please provide a complete address'
                        break

                    case 'phone:too_small':
                        message = 'Please provide a phone number'
                        break

                    case 'phone:invalid_format':
                        message = 'Please provide a valid phone number'
                        break

                    case 'isrCode:too_small':
                        message = 'Please enter an ISR code'
                        break

                    case 'isrCode:invalid_format':
                        message = 'Please enter a valid ISR code'
                        break

                    case 'sapCode:too_small':
                        message = 'Please enter an SAP code'
                        break

                    case 'sapCode:invalid_format':
                        message = 'Please enter a valid SAP code'
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

        try {
            this.open = false
            this.loading = true

            const response = await api.post('accounts/update', { json: this.data })
            const body = (await response.json()) as Json
            const account = body.data

            this.loading = false
            this.success = true

            accounts.update(account)
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
    }

    async submit() {
        if (!this.validate()) return

        await this.send()
    }
}

export default new UpdateContext()
