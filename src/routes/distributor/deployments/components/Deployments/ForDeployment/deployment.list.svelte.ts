import api from '$lib/api'
import { originStatus } from '$lib/config/deployment.status'

class DeploymentList {
    loading = $state(false)

    items: Json[] = $state([])

    async fetch() {
        if (this.loading) return

        this.loading = true

        const response = await api.post('distributor/deployments', {
            json: {
                status: originStatus.FOR_DELIVERY
            }
        })

        const body: Data<{ items: Json[]; nextCursor: string }> = await response.json()
        const { items } = body.data

        this.items = items
        this.loading = false
    }
}

export default new DeploymentList()
