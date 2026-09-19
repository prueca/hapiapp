import _ from 'lodash'
import * as t from '$lib/drizzle/schema'

class CreateContext {
    open = $state(false)

    loading = $state(false)

    error: App.Error | null = $state(null)

    data = $state<{
        accountId: string | null
        firstName: string | null
        middleName: string | null
        lastName: string | null
        isAdmin: boolean
        address: string | null
        phone: string | null
    }>({
        accountId: null,
        firstName: null,
        middleName: null,
        lastName: null,
        isAdmin: true,
        address: null,
        phone: null
    })

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
    }

    selectAccount(accountId: string) {
        this.data.accountId = accountId
    }

    submit() {
        console.log(this.data.isAdmin)
    }
}

export default new CreateContext()
