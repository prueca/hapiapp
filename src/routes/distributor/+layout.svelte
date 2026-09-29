<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
    import { setContext, type Snippet } from 'svelte'

    let {
        data,
        children
    }: {
        data: App.Locals
        children: Snippet
    } = $props()

    setContext('auth', {
        user: data.user,
        account: data.account
    })
</script>

{@render children()}
