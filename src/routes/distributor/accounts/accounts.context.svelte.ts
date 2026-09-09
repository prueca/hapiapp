import * as t from '$lib/drizzle/schema'
import api from '$lib/api'
import _ from 'lodash'
import errors from '$lib/errors'

class AccountsContext {
    loading = $state(false)
    error: string | null = $state(null)

    list: Account[] = $state([])
    filtered: Account[] = $state([])

    limit = 10
    total = $state(0)

    query = $state('')
    accountType = $state('')
    sortBy = $state('createdAt')
    sortOrder = $state('desc')

    openSearchOptions = $state(false)

    async load() {
        try {
            this.error = null
            this.loading = true

            const response = await api.post('accounts', { json: {} })
            const body: Json = await response.json()

            if (!response.ok) {
                this.loading = false
                this.error = body.code
                return
            }

            this.list = body.data.items
            this.filtered = _.take(this.list, this.limit)
            this.total = this.list.length

            this.loading = false
        } catch (e: any) {
            this.loading = false
            this.error = e.name ?? errors.UNKNOWN_ERROR.code
        }
    }

    filter(limit = this.limit) {
        const matches = _.chain(this.list)
            .filter((x) => {
                const accountName = _.toLower(x.name)
                const query = _.toLower(this.query).trim()

                if (query && this.accountType) {
                    const matches = _.includes(accountName, query) && x.type === this.accountType

                    return matches
                }

                if (query) {
                    const matches = _.includes(accountName, query)

                    return matches
                }

                if (this.accountType) {
                    const matches = x.type === this.accountType

                    return matches
                }

                return true
            })
            .orderBy([this.sortBy, this.sortOrder])
            .value()

        this.filtered = _.take(matches, limit)
        this.total = matches.length
    }

    loadMore() {
        this.filter(this.filtered.length + this.limit)
    }

    toggleSearchOptions() {
        this.openSearchOptions = !this.openSearchOptions
    }
}

export default new AccountsContext()
