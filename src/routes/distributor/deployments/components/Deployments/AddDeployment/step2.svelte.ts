import _ from 'lodash'
import api from '$lib/api'
import errors from '$lib/errors'
import { StatusCodes } from 'http-status-codes'

class Step2 {
    query = $state('')

    loading = $state(false)

    accounts: Json[] | null = $state(null)

    message: string | null = $state(null)

    async searchAccount() {
        if (!this.query) return

        this.accounts = null
        this.loading = true
        this.message = 'Searching for accounts...'

        try {
            const response = await api.post('distributor/deployments/search/account', {
                json: {
                    query: this.query
                }
            })

            const body = (await response.json()) as Json
            const { items } = body.data

            this.accounts = items ?? []
            this.loading = false
            this.message = null

            if (_.isArray(this.accounts) && _.isEmpty(this.accounts)) {
                this.message = errors.NOT_FOUND.message
            }
        } catch (e: any) {
            this.loading = false

            switch (e.name) {
                case 'HTTPError':
                    this.message = `Error ${e.data?.code}`

                    if (e.response.status === StatusCodes.NOT_FOUND) {
                        if (e.data?.code !== errors.NOT_FOUND.code) {
                            // This means the api url does not exists
                            this.message = `Error ${errors.NOT_FOUND.code}`
                        } else {
                            this.message = errors.NOT_FOUND.message
                        }
                    }

                    break

                case 'NetworkError':
                    this.message = `Error: ${errors.NETWORK_ERROR.code}`
                    break

                case 'TypeError':
                    this.message = `Error: ${errors.TYPE_ERROR.code}`
                    break
            }
        }
    }
}

export default new Step2()
