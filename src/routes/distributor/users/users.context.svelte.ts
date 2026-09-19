import _ from 'lodash'
import * as t from '$lib/drizzle/schema'
import api from '$lib/api'
import errors from '$lib/errors'

type User = typeof t.user.$inferSelect

class UsersContext {
    loading = $state(false)
    error: string | null = $state(null)

    list: User[] = $state([])
    filtered: User[] = $state([])

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

            const response = await api.post('users', { json: {} })
            const body: Data<{ items: User[] }> = await response.json()

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
                const firstName = _.toLower(x.firstName)
                const middleName = (x.middleName && _.toLower(x.middleName)) || ''
                const lastName = _.toLower(x.lastName)

                const fullName = `${firstName} ${middleName} ${lastName}`
                const query = _.toLower(this.query).trim()

                if (query) {
                    const matches = _.includes(fullName, query)

                    return matches
                }

                return true
            })
            .orderBy([this.sortBy, 'name'], [this.sortOrder as 'asc' | 'desc', 'asc'])
            .value()

        this.filtered = _.take(matches, limit)
        this.total = matches.length
    }

    showMore() {
        this.filter(this.filtered.length + this.limit)
    }

    toggleSearchOptions(flag: boolean) {
        this.openSearchOptions = flag
    }

    remove(userId: string) {
        this.list = _.filter(this.list, (x) => x.id !== userId)
        this.filtered = _.filter(this.filtered, (x) => x.id !== userId)
    }

    update(user: User) {
        this.list = _.map(this.list, (x) => (x.id === user.id ? user : x))
        this.filtered = _.map(this.filtered, (x) => (x.id === user.id ? user : x))
    }
}

export default new UsersContext()
