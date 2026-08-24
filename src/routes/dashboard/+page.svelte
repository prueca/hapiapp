<script lang="ts">
    import Dock from '../components/Dock.svelte'
    import MerchantName from '../components/MerchantName.svelte'
    import TopBar from '../components/TopBar'

    // Mock data for graph
    const chartData = [
        { label: 'Mon', value: 400 },
        { label: 'Tue', value: 300 },
        { label: 'Wed', value: 500 },
        { label: 'Thu', value: 200 },
        { label: 'Fri', value: 600 },
        { label: 'Sat', value: 400 },
        { label: 'Sun', value: 300 },
    ]

    // Mock data for list
    const listData = [
        { id: 1, name: 'Item 1', status: 'Active' },
        { id: 2, name: 'Item 2', status: 'Pending' },
        { id: 3, name: 'Item 3', status: 'Inactive' },
    ]
</script>

<div class="content-wrapper">
    <TopBar />
    <MerchantName />
    <h1 class="mb-8 text-3xl font-bold">Dashboard</h1>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Accounts -->
        <a href="/dashboard/accounts" class="card border border-gray-200 bg-base-100 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div class="card-body flex min-h-25 w-full items-center justify-center">
                <h2 class="card-title text-center">Accounts</h2>
            </div>
        </a>

        <!-- Users -->
        <a href="/dashboard/users" class="card border border-gray-200 bg-base-100 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div class="card-body flex min-h-25 w-full items-center justify-center">
                <h2 class="card-title text-center">Users</h2>
            </div>
        </a>

        <!-- Freezers -->
        <a href="/dashboard/freezers" class="card border border-gray-200 bg-base-100 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div class="card-body flex min-h-25 w-full items-center justify-center">
                <h2 class="card-title text-center">Freezers</h2>
            </div>
        </a>

        <!-- Cabcon -->
        <a href="/dashboard/cabcon" class="card border border-gray-200 bg-base-100 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div class="card-body flex min-h-25 w-full items-center justify-center">
                <h2 class="card-title text-center">Cabcon</h2>
            </div>
        </a>

        <!-- Products -->
        <a href="/dashboard/products" class="card border border-gray-200 bg-base-100 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div class="card-body flex min-h-25 w-full items-center justify-center">
                <h2 class="card-title text-center">Products</h2>
            </div>
        </a>

        <!-- Order -->
        <a href="/dashboard/order" class="card border border-gray-200 bg-base-100 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div class="card-body flex min-h-25 w-full items-center justify-center">
                <h2 class="card-title text-center">Order</h2>
            </div>
        </a>

        <!-- Bad Order -->
        <a href="/dashboard/bad-order" class="card border border-gray-200 bg-base-100 p-6 shadow-sm transition-shadow hover:shadow-md lg:col-start-2">
            <div class="card-body flex min-h-25 w-full items-center justify-center">
                <h2 class="card-title text-center">Bad Order</h2>
            </div>
        </a>
    </div>
    <Dock />
</div>
