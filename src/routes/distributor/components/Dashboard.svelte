<script lang="ts">
    import accountIcon from '$lib/assets/icons/passport-svgrepo-com.svg'
    import userIcon from '$lib/assets/icons/users-group-two-rounded-svgrepo-com.svg'
    import freezerIcon from '$lib/assets/icons/fridge-svgrepo-com.svg'
    import deploymentIcon from '$lib/assets/icons/truck-fast-svgrepo-com.svg'
    import cabconIcon from '$lib/assets/icons/cardholder-svgrepo-com.svg'
    import productIcon from '$lib/assets/icons/notes-svgrepo-com.svg'
    import orderIcon from '$lib/assets/icons/bag-smile-svgrepo-com.svg'
    import badOrderIcon from '$lib/assets/icons/bag-cross-svgrepo-com.svg'
</script>

<div class="dashboard">
    <h1 class="dashboard-title">
        <div class="mb-1 text-xl">Dashboard</div>
        <div class="text-xs text-gray-400">Manage orders, freezers, products and more...</div>
    </h1>
    <div class="dashboard-menu">
        <a href="/distributor/accounts" class="menu-item">
            <div class="image-wrapper">
                <img src={accountIcon} alt="" width="32" height="32" />
            </div>
            <div class="item-label">Accounts</div>
        </a>
        <a href="/distributor/users" class="menu-item">
            <div class="image-wrapper">
                <img src={userIcon} alt="" width="32" height="32" />
            </div>
            <div class="item-label">Users</div>
        </a>
        <a href="/distributor/freezer" class="menu-item">
            <div class="image-wrapper">
                <img src={freezerIcon} alt="" width="32" height="32" />
            </div>
            <div class="item-label">Freezers</div>
        </a>
        <a href="/distributor/freezer" class="menu-item">
            <div class="image-wrapper">
                <img src={deploymentIcon} alt="" width="32" height="32" />
            </div>
            <div class="item-label">Deployments</div>
        </a>
        <a href="/distributor/cabcon" class="menu-item">
            <div class="image-wrapper">
                <img src={cabconIcon} alt="" width="32" height="32" />
            </div>
            <div class="item-label">Cabcon</div>
        </a>
        <a href="/distributor/products" class="menu-item">
            <div class="image-wrapper">
                <img src={productIcon} alt="" width="32" height="32" />
            </div>
            <div class="item-label">Products</div>
        </a>
        <a href="/distributor/orders" class="menu-item">
            <div class="image-wrapper">
                <img src={orderIcon} alt="" width="32" height="32" />
            </div>
            <div class="item-label">Orders</div>
        </a>
        <a href="/distributor/bad-orders" class="menu-item">
            <div class="image-wrapper">
                <img src={badOrderIcon} alt="" width="32" height="32" />
            </div>
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

        .image-wrapper {
            @apply rounded-full bg-gray-100 p-3;
        }

        img {
            filter: sepia(1) saturate(25) hue-rotate(360deg);
        }
    }

    .item-label {
        @apply mt-2 text-sm whitespace-nowrap;
    }
</style>
