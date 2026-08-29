<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
    import './layout.css'
    import favicon from '$lib/assets/favicon.svg'
    import { setContext } from 'svelte'

    let { data, children } = $props()

    setContext<{ user: AuthUser; account: AuthAccount }>('auth', {
        user: data.user!,
        account: data.account!
    })
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
