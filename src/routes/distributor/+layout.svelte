<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
    import { setContext } from 'svelte'

    let { data, children } = $props()

    setContext('auth', {
        user: data.user,
        account: data.account
    })
</script>

{@render children()}
