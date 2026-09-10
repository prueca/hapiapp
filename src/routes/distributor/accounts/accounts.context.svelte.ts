import * as t from '$lib/drizzle/schema'
import api from '$lib/api'
import _ from 'lodash'
import errors from '$lib/errors'

type Account = typeof t.account.$inferSelect

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
            const body: Data<{ items: Account[] }> = await response.json()

            this.list = body.data.items
            this.filtered = _.take(this.list, this.limit)
            this.total = this.list.length

            this.loading = false
        } catch (e: any) {
            this.loading = false
            this.error = errors.UNEXPECTED_ERROR.message

            switch (e.name) {
                case 'HTTPError':
                    this.error = e.data.message

                    if (e.response.status === 404 && e.data?.code !== errors.NOT_FOUND.code) {
                        this.error = errors.NOT_FOUND.message
                    }

                    break

                case 'NetworkError':
                    this.error = errors.NETWORK_ERROR.message
                    break

                case 'TypeError':
                    this.error = errors.TYPE_ERROR.message
                    break
            }
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
            .orderBy([this.sortBy, 'name'], [this.sortOrder as 'asc' | 'desc', 'asc'])
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

    remove(accountId: string) {
        this.list = _.filter(this.list, (x) => x.id !== accountId)
        this.filtered = _.filter(this.filtered, (x) => x.id !== accountId)
    }
}

export default new AccountsContext()
