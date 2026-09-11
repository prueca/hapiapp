import api from '$lib/api'
import _ from 'lodash'
import errors from '$lib/errors'
import accounts from './accounts.context.svelte'

class DeleteContext {
    open = $state(false)

    target: string | null = $state(null)

    loading = $state(false)
    success = $state(false)
    error: App.Error | null = $state(null)

    setOpen(flag: boolean) {
        if (!this.open) {
            this.error = null
        }

        if (!flag) {
            this.success = false
        }

        this.open = flag
    }

    confirm(id: string) {
        this.target = id
        this.setOpen(true)
    }

    async proceed() {
        if (this.loading) return

        try {
            this.setOpen(false)
            this.loading = true

            await api.post('accounts/delete', {
                json: { id: this.target }
            })

            this.loading = false
            this.success = true

            accounts.remove(this.target as string)
        } catch (e: any) {
            this.loading = false
            this.error = errors.UNEXPECTED_ERROR

            switch (e.name) {
                case 'HTTPError':
                    this.error = e.data

                    if (e.response.status === 404 && e.data?.code !== errors.NOT_FOUND.code) {
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
}

export default new DeleteContext()
