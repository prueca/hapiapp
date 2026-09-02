import * as t from '$lib/drizzle/schema'
import api from '$lib/api'
import _ from 'lodash'

type Account = typeof t.account.$inferSelect

class AccountsContext {
    loading = $state(false)

    list: Account[] = $state([])
    filtered: Account[] = $state([])

    limit = 10
    total = $state(0)

    query = $state('')
    accountType = $state('')
    sortBy = $state('id')
    sortOrder = $state('asc')

    openSearchOptions = $state(false)

    async load() {
        this.loading = true

        const res = await api.post('accounts', { json: {} })
        const response: Data<{ items: Account[] }> = await res.json()

        this.list = response.data.items
        this.filtered = _.take(this.list, this.limit)
        this.total = this.list.length

        this.loading = false
    }

    filter(limit = this.limit) {
        const matches = _.chain(this.list)
            .filter((x) => {
                const accountName = _.toLower(x.name)
                const companyCode = _.toLower(x.companyCode as string)
                const query = _.toLower(this.query).trim()

                if (query && this.accountType) {
                    const matches =
                        (_.includes(accountName, query) || _.includes(companyCode, query)) &&
                        x.type === this.accountType

                    return matches
                }

                if (query) {
                    const matches = _.includes(accountName, query) || _.includes(companyCode, query)

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
