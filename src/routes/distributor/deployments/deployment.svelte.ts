import _ from 'lodash'
import api from '$lib/api'
import errors from '$lib/errors'
import step1 from './step1.svelte'
import step2 from './step2.svelte'

class Deployment {
    currentStep = $state<1 | 2 | 3>(1)

    freezers: Json[] = $state([])

    destinationAccount: Json | null = $state(null)

    deploymentDate: string | null = $state(null)

    loading = $state(false)

    success = $state(false)

    error: App.Error | null = $state(null)

    data: Json | null = $state(null)

    setCurrentStep(step: 1 | 2 | 3) {
        this.currentStep = step
    }

    addFreezer(freezer: Json) {
        this.freezers.push(freezer)
    }

    removeFreezer(freezerId: string) {
        this.freezers = this.freezers.filter((freezer) => freezer.id !== freezerId)
    }

    setDestinationAccount(account: Json | null) {
        this.destinationAccount = account
    }

    async submit() {
        if (!!!(this.freezers.length && this.destinationAccount && this.deploymentDate)) {
            return
        }

        this.loading = true

        try {
            const response = await api.post('distributor/deployments/create', {
                json: {
                    freezerIds: _.map(this.freezers, 'id'),
                    destinationId: this.destinationAccount.id,
                    deploymentDate: this.deploymentDate
                }
            })

            const body = (await response.json()) as Json

            this.data = body.data
            this.loading = false
            this.success = true

            this.freezers = []
            this.destinationAccount = null
            this.deploymentDate = null

            step1.barcode = ''
            step1.freezer = null

            step2.accounts = null
            step2.query = ''

            this.currentStep = 1
        } catch (e: any) {
            this.loading = false
            this.error = errors.UNEXPECTED_ERROR

            switch (e.name) {
                case 'HTTPError':
                    this.error = e.data

                    if (e.response.status === 404 && e.data?.code !== errors.NOT_FOUND.code) {
                        // Receiving a 404 status without error code means
                        // the url does not exists. This equates to NOT_FOUND error.
                        this.error = errors.NOT_FOUND
                    }

                    break

                case 'NetworkError':
                    this.error = errors.NETWORK_ERROR
                    break

                case 'TypeError':
                    this.error = errors.TYPE_ERROR
                    break
            }
        }
    }

    reset() {
        this.loading = false
        this.success = false
        this.error = null
        this.data = null
    }
}

export default new Deployment()
