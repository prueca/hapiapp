import api from '$lib/api'
import errors from '$lib/errors'
import z from 'zod'
import _ from 'lodash'
import users from './users.context.svelte'

class UpdateContext {
    open = $state(false)

    loading = $state(false)

    success = $state(false)

    error: App.Error | null = $state(null)

    data = $state<{
        id: string | null
        firstName: string | null
        middleName: string | null
        lastName: string | null
        address: string | null
        phone: string | null
        isAdmin: boolean
    }>({
        id: null,
        firstName: null,
        middleName: null,
        lastName: null,
        address: null,
        phone: null,
        isAdmin: false
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

    select(id: string) {
        const user = _.find(users.list, (x) => x.id === id)!

        this.data = _.pick(user, [
            'firstName',
            'middlename',
            'lastName',
            'address',
            'phone'
        ]) as typeof this.data

        _.assign(this.data, {
            id: user.id,
            isAdmin: _.endsWith(user.role, '-admin')
        })

        this.toggle(true)
    }
}

export default new UpdateContext()
