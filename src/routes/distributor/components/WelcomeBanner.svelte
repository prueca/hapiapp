<script lang="ts">
    import Icon from '@iconify/svelte'
    import roles from '$lib/config/user.roles'

    let { data } = $props()
    let user = $derived(data.user)
    let account = $derived(data.account)

    let loggedInAs = $derived.by(() => {
        switch (user.role) {
            case roles.DISTRIBUTOR_ADMIN:
                return 'Admin Distributor'
            case roles.DISTRIBUTOR_USER:
                return 'Distributor'
            case roles.DEALER_ADMIN:
                return 'Admin Dealer'
            case roles.DEALER_USER:
                return 'Dealer'
            case roles.FRANCHISEE_ADMIN:
                return 'Admin Franchisee'
            case roles.FRANCHISEE_USER:
                return 'Franchisee'
            default:
                return ''
        }
    })
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
        @apply mx-4 mt-2 mb-4 rounded-lg bg-(--c1) p-4 text-white;
        background: linear-gradient(135deg, #e16660, #f5b8b4);
    }
</style>
