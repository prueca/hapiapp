import _ from 'lodash'
import z from 'zod'
import accountTypes from '$lib/config/account.types'

class CreateContext {
    open = $state(false)
    loading = $state(false)

    data = $state({
        type: '',
        name: '',
        address: '',
        phone: '',
        isrCode: '',
        sapCode: ''
    })

    issues = $state({
        type: null,
        name: null,
        address: null,
        phone: null,
        isrCode: null,
        sapCode: null
    })

    toggle() {
        this.open = !this.open
    }

    validate() {
        const schema = z.object({
            type: z.enum([accountTypes.DEALER, accountTypes.HAPISTORE]),
            name: z.string().nonempty(),
            address: z.string().nonempty(),
            phone: z
                .string()
                .regex(/^09\d[9]$/)
                .nonempty(),
            isrCode: z
                .string()
                .regex(/^[A-Z0-9]{10,20}$/)
                .nonempty(),
            sapCode: z
                .string()
                .regex(/^[A-Z0-9]{10,20}$/)
                .nonempty()
        })

        const result = schema.safeParse(this.data)

        if (!result.success && result.error) {
            _.map(_.keys(this.issues), (k) => {
                this.issues[k as keyof typeof this.issues] = null
            })

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
}

export default new CreateContext()
