<script lang="ts">
    import api from '$lib/api'
    import { goto } from '$app/navigation'
    import errors from '$lib/errors'
    import Icon from '@iconify/svelte'

    let isLoggingOut = $state(false)
    let error = $state<null | string>(null)

    async function logout() {
        if (isLoggingOut) {
            return
        }

        error = null
        isLoggingOut = true

        try {
            await api.post('logout')
            goto('/login')
        } catch (e: any) {
            isLoggingOut = false
            error = errors.UNEXPECTED_ERROR.message

            switch (e.name) {
                case 'HTTPError':
                    error = e.data.message

                    if (e.response.status === 404 && e.data?.code !== errors.NOT_FOUND.code) {
                        error = errors.NOT_FOUND.message
                    }

                    break

                case 'NetworkError':
                    error = errors.NETWORK_ERROR.message
                    break

                case 'TypeError':
                    error = errors.TYPE_ERROR.message
                    break
            }
        }
    }
</script>

<button
    type="button"
    class="btn p-0 btn-link no-underline"
    disabled={isLoggingOut}
    onclick={logout}
>
    <div class="flex items-center gap-2">
        <span>Logout</span>
        <Icon icon="material-symbols-light:logout-rounded" width="24" />
    </div>
</button>

{#if error}
    <div class="text-xs text-red-500">{error}</div>
{/if}
