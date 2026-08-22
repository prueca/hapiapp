<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import MerchantName from '../../components/MerchantName.svelte'
    import TopBar from '../../components/TopBar'
    import accountIcon from '$lib/icons/passport-svgrepo-com.svg'
    import userIcon from '$lib/icons/users-group-two-rounded-svgrepo-com.svg'
    import freezerIcon from '$lib/icons/fridge-svgrepo-com.svg'
    import cabconIcon from '$lib/icons/cardholder-svgrepo-com.svg'
    import productIcon from '$lib/icons/notes-svgrepo-com.svg'
    import orderIcon from '$lib/icons/bag-smile-svgrepo-com.svg'
    import badOrderIcon from '$lib/icons/bag-cross-svgrepo-com.svg'
</script>

<div class="content-wrapper">
    <TopBar />
    <MerchantName />

    <div class="dashboard">
        <h1 class="dashboard-title">Dashboard</h1>
        <div class="dashboard-menu">
            <a href="/distributor/accounts" class="menu-item">
                <img src={accountIcon} alt="" width="48" height="48" />
                <div class="item-label">Accounts</div>
            </a>
            <a href="/distributor/users" class="menu-item">
                <img src={userIcon} alt="" width="48" height="48" />
                <div class="item-label">Users</div>
            </a>
            <a href="/distributor/freezer" class="menu-item">
                <img src={freezerIcon} alt="" width="48" height="48" />
                <div class="item-label">Freezers</div>
            </a>
            <a href="/distributor/cabcon" class="menu-item">
                <img src={cabconIcon} alt="" width="48" height="48" />
                <div class="item-label">Cabcon</div>
            </a>
            <a href="/distributor/products" class="menu-item">
                <img src={productIcon} alt="" width="48" height="48" />
                <div class="item-label">Products</div>
            </a>
            <a href="/distributor/orders" class="menu-item">
                <img src={orderIcon} alt="" width="48" height="48" />
                <div class="item-label">Orders</div>
            </a>
            <a href="/distributor/bad-orders" class="menu-item">
                <img src={badOrderIcon} alt="" width="48" height="48" />
                <div class="item-label">Bad Orders</div>
            </a>
        </div>
    </div>

    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .dashboard {
        @apply relative -mt-10 p-4;
    }

    .dashboard-title {
        @apply mb-10 text-3xl;
    }

    .dashboard-menu {
        @apply grid grid-cols-3 gap-8;
    }

    .menu-item {
        @apply flex flex-col items-center text-center;

        /*& > img {
            filter: sepia(1) saturate(25) hue-rotate(360deg);
        }*/
    }

    .item-label {
        @apply mt-2;
    }
</style>
