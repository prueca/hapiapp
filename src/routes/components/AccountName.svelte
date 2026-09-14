<script lang="ts">
    import { getContext } from 'svelte'
    import { getDisplayText } from '$lib/config/user.roles'

    const auth = getContext<{ user: AuthUser; account: AuthAccount }>('auth')

    let role = $derived.by(() => getDisplayText(auth.user.role))
</script>

<div class="account-name">
    <div class="mb-1">{auth.account.name}</div>
    <div class="text-xs">{role}</div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .account-name {
        @apply mx-4 mb-6 rounded-lg bg-(--c1) px-4 py-3 text-(--c5);
        /*background: linear-gradient(135deg, #e16660, #f5b8b4);*/
    }
</style>
