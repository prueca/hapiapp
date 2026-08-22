<script lang="ts">
    import accountIcon from '$lib/icons/passport-svgrepo-com.svg'
    import userIcon from '$lib/icons/users-group-two-rounded-svgrepo-com.svg'
    import freezerIcon from '$lib/icons/fridge-svgrepo-com.svg'
    import cabconIcon from '$lib/icons/cardholder-svgrepo-com.svg'
    import productIcon from '$lib/icons/notes-svgrepo-com.svg'
    import orderIcon from '$lib/icons/bag-smile-svgrepo-com.svg'
    import badOrderIcon from '$lib/icons/bag-cross-svgrepo-com.svg'
</script>

<div class="dashboard">
    <h1 class="dashboard-title">
        <div class="mb-1 text-xl">Dashboard</div>
        <div class="text-xs text-gray-400">Manage orders, freezers, products and more...</div>
    </h1>
    <div class="dashboard-menu">
        <a href="/distributor/dashboard/accounts" class="menu-item">
            <img src={accountIcon} alt="" width="32" height="32" />
            <div class="item-label">Accounts</div>
        </a>
        <a href="/distributor/dashboard/users" class="menu-item">
            <img src={userIcon} alt="" width="32" height="32" />
            <div class="item-label">Users</div>
        </a>
        <a href="/distributor/dashboard/freezer" class="menu-item">
            <img src={freezerIcon} alt="" width="32" height="32" />
            <div class="item-label">Freezers</div>
        </a>
        <a href="/distributor/dashboard/cabcon" class="menu-item">
            <img src={cabconIcon} alt="" width="32" height="32" />
            <div class="item-label">Cabcon</div>
        </a>
        <a href="/distributor/dashboard/products" class="menu-item">
            <img src={productIcon} alt="" width="32" height="32" />
            <div class="item-label">Products</div>
        </a>
        <a href="/distributor/dashboard/orders" class="menu-item">
            <img src={orderIcon} alt="" width="32" height="32" />
            <div class="item-label">Orders</div>
        </a>
        <a href="/distributor/dashboard/bad-orders" class="menu-item">
            <img src={badOrderIcon} alt="" width="32" height="32" />
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

        img {
            filter: sepia(1) saturate(25) hue-rotate(360deg);
        }
    }

    .item-label {
        @apply mt-2 text-sm whitespace-nowrap;
    }
</style>
