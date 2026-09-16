<script lang="ts">
    import { getContext } from 'svelte'
    import { getDisplayText } from '$lib/config/user.roles'
    import Icon from '@iconify/svelte'

    const { user, account } = getContext<{ user: AuthUser; account: AuthAccount }>('auth')

    let loggedInAs = $derived.by(() => getDisplayText(user.role))
</script>

<div class="welcome-banner">
    <div class="mb-8 flex items-start justify-between">
        <div>
            <div class="mb-1 text-xl">Good day, {user.firstName}</div>
            <div class="text-sm">Logged in as {loggedInAs}</div>
        </div>
        <Icon icon="streamline-flex:smiley-blessed-solid" width="48" />
    </div>
    <div>
        <div class="mb-1 text-sm">{account.name}</div>
        <div class="text-sm">{account.address}</div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .welcome-banner {
        @apply mx-4 mb-4 rounded-lg bg-(--c1) p-4 text-white;
        /*background: linear-gradient(135deg, #e16660, #f5b8b4);*/
    }
</style>
