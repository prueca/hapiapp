<script lang="ts">
    import { getContext } from 'svelte'
    import roles from '$lib/config/user.roles'

    const auth = getContext<{ user: AuthUser; account: AuthAccount }>('auth')

    let role = $derived.by(() => {
        switch (auth.user.role) {
            case roles.DISTRIBUTOR_ADMIN:
                return 'Admin Distributor'
            case roles.DISTRIBUTOR_USER:
                return 'Distributor'
            case roles.DEALER_ADMIN:
                return 'Admin Dealer'
            case roles.DEALER_USER:
                return 'Dealer'
            case roles.HAPISTORE_ADMIN:
                return 'Admin Hapistore'
            case roles.HAPISTORE_USER:
                return 'Hapistore'
            default:
                return ''
        }
    })
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
