import type Account from '$lib/db/Account'
import api from '$lib/api'
import _ from 'lodash'

class SearchContext {
    accounts: Account[] = $state([])

    loading = $state(false)

    query = $state('')
    openSearchOptions = $state(false)

    async submit() {
        this.loading = true

        const res = await api.post('accounts', {
            json: { query: this.query }
        })

        const response: Data<{ items: Account[]; nextCusror?: string }> = await res.json()

        this.accounts = response.data.items

        this.loading = false
    }

    toggleSearchOptions() {
        this.openSearchOptions = !this.openSearchOptions
    }
}

export default new SearchContext()
