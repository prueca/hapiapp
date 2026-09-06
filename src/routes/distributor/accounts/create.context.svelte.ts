import _ from 'lodash'
import z from 'zod'
import accountTypes from '$lib/config/account.types'
import api from '$lib/api'

class CreateContext {
    open = $state(false)

    loading = $state(false)

    error: string | null = $state(null)

    data = $state({
        type: 'dealer',
        name: 'wancavino',
        address: 'montalban, rizal',
        phone: '09168728941',
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

    reset() {
        this.error = null
        this.loading = false

        _.map(_.keys(this.issues), (k) => {
            this.issues[k as keyof typeof this.issues] = null
        })
    }

    toggle() {
        !this.open && this.reset()
        this.open = !this.open
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
            this.reset()

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

        this.open = false
        this.loading = true

        try {
            await api.post('accounts/create', { json: this.data })
            this.loading = false

            // redirect to account view page upon success
        } catch (e: any) {
            this.error = e.message
            this.loading = false
        }
    }

    async submit() {
        if (!this.validate()) return

        await this.send()
    }
}

export default new CreateContext()
