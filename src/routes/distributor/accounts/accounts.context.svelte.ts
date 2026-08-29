import type Account from '$lib/db/Account'
import api from '$lib/api'
import _ from 'lodash'

class AccountsContext {
    loading = $state(false)

    list: Account[] = $state([])
    filtered: Account[] = $state([])

    query = $state('')
    accountType = $state('')
    sortBy = $state('id')
    sortOrder = $state('asc')

    openSearchOptions = $state(false)

    async load() {
        this.loading = true

        const res = await api.post('accounts', { json: {} })
        const response: Data<{ items: Account[]; nextCusror?: string }> = await res.json()

        this.list = response.data.items
        this.filtered = _.take(this.list, 10)
        this.loading = false
    }

    filter() {
        this.filtered = _.chain(this.list)
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
            .take(10)
            .value()
    }

    toggleSearchOptions() {
        this.openSearchOptions = !this.openSearchOptions
    }
}

export default new AccountsContext()
