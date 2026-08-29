<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="dashboard">
    <h1 class="dashboard-title">
        <div class="mb-1 text-xl">Dashboard</div>
        <div class="text-xs text-gray-400">Manage orders, freezers, products and more...</div>
    </h1>
    <div class="dashboard-menu">
        <a href="/distributor/accounts" class="menu-item">
            <span class="text-(--c1)">
                <Icon icon="bi:passport-fill" width="42" />
            </span>
            <div class="item-label">Accounts</div>
        </a>
        <a href="/distributor/users" class="menu-item">
            <span class="text-(--c1)">
                <Icon icon="flowbite:users-group-solid" width="42" />
            </span>
            <div class="item-label">Users</div>
        </a>
         <a href="/distributor/freezers" class="menu-item">
             <span class="text-(--c1)">
                 <Icon icon="reicon:fridge-filled" width="42" />
             </span>
             <div class="item-label">Freezers</div>
        </a>
        <a href="/distributor/freezer" class="menu-item">
            <span class="text-(--c1)">
                <Icon icon="reicon:truck-fast-filled" width="42" />
            </span>
            <div class="item-label">Deployments</div>
        </a>
        <a href="/distributor/cabcon" class="menu-item">
            <span class="text-(--c1)">
                <Icon icon="reicon:cardholder-filled" width="42" />
            </span>
            <div class="item-label">Cabcon</div>
        </a>
        <a href="/distributor/products" class="menu-item">
            <span class="text-(--c1)">
                <Icon icon="reicon:notes-filled" width="42" />
            </span>
            <div class="item-label">Products</div>
        </a>
        <a href="/distributor/orders" class="menu-item">
            <span class="text-(--c1)">
                <Icon icon="reicon:bag-smile-filled" width="42" />
            </span>
            <div class="item-label">Orders</div>
        </a>
        <a href="/distributor/bad-orders" class="menu-item">
            <span class="text-(--c1)">
                <Icon icon="solar:bag-cross-bold" width="42" />
            </span>
            <div class="item-label">Bad Orders</div>
        </a>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .dashboard {
        @apply relative p-4;
    }

    .dashboard-title {
        @apply mb-4;
    }

    .dashboard-menu {
        @apply grid grid-cols-3 gap-8 rounded-lg bg-white px-4 py-6;
    }

    .menu-item {
        @apply flex flex-col items-center text-center;
    }

    .item-label {
        @apply mt-2 text-sm whitespace-nowrap;
    }
</style>
