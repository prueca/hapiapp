import type Account from '$lib/db/Account'
import api from '$lib/api'
import _ from 'lodash'

class AccountsContext {
    list: Account[] = $state([])

    loading = $state(false)

    query = $state('')
    openSearchOptions = $state(false)

    async load() {
        this.loading = true

        const res = await api.post('accounts', { json: {} })
        const response: Data<{ items: Account[]; nextCusror?: string }> = await res.json()

        this.list = response.data.items
        this.loading = false
    }

    toggleSearchOptions() {
        this.openSearchOptions = !this.openSearchOptions
    }
}

export default new AccountsContext()
