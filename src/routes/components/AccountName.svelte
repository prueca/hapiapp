<script lang="ts">
    import roles from '$lib/config/user.roles'

    let { account, role } = $props()

    let userRole = $derived.by(() => {
        switch (role) {
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

<div class="account-name">
    <div class="mb-1">{account}</div>
    <div class="text-xs">{userRole}</div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .account-name {
        @apply mx-4 mb-6 rounded-lg bg-(--c1) px-4 py-3 text-(--c5);
        /*background: linear-gradient(135deg, #e16660, #f5b8b4);*/
    }
</style>
