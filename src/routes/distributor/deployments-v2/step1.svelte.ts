import { StatusCodes } from 'http-status-codes'

import api from '$lib/api'
import errors from '$lib/errors'
import deployment from './deployment.svelte'

class Step1 {
    barcode = $state('')

    loading = $state(false)

    freezer: Json | null = $state(null)

    message: string | null = $state(null)

    async searchFreezer() {
        if (!this.barcode) return

        this.freezer = null
        this.loading = true
        this.message = 'Searching for freezer...'

        try {
            const response = await api.post('distributor/deployments/search/freezer', {
                json: {
                    barcode: this.barcode
                }
            })

            const body = (await response.json()) as Json
            const freezer = body.data

            this.freezer = freezer
            this.loading = false
            this.message = null
        } catch (e: any) {
            this.loading = false

            switch (e.name) {
                case 'HTTPError':
                    if (e.response.status === StatusCodes.NOT_FOUND) {
                        if (e.data?.code !== errors.NOT_FOUND.code) {
                            // This means the api url does not exists
                            this.message = `Error ${errors.NOT_FOUND.code}`
                        } else {
                            this.message = 'Freezer was not found'
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

    clear() {
        this.barcode = ''
    }
}

export default new Step1()
