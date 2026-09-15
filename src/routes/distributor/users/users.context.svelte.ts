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
}

export default new UsersContext()
