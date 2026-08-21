<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import MerchantName from '../../components/MerchantName.svelte'
    import TopBar from '../../components/TopBar'

    // Mock Data
    const chartData = [
        { label: 'Mon', value: 50 },
        { label: 'Tue', value: 80 },
        { label: 'Wed', value: 120 },
        { label: 'Thu', value: 90 },
        { label: 'Fri', value: 150 },
    ]

    const listData = [
        { id: 1, orderNum: 'ORD-001', status: 'Delivered' },
        { id: 2, orderNum: 'ORD-002', status: 'Processing' },
        { id: 3, orderNum: 'ORD-003', status: 'Shipped' },
    ]
</script>

<div class="content-wrapper">
    <TopBar />
    <MerchantName />
    
    <div class="p-6 min-h-screen">
        <h1 class="text-2xl font-bold mb-6">Orders</h1>
        
        <!-- Graph Section (Mock Bar Chart) -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold mb-4">Order Volume Graph</h2>
            <div class="bg-gray-100 p-4 rounded-lg h-40 flex items-center justify-center">
                <p class="text-gray-500">[Bar Chart Placeholder - Data: {chartData}]</p>
            </div>
        </div>

        <!-- List Section (Mock Data) -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold mb-4">Orders List</h2>
            <div class="border rounded-lg overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-gray-50">
                        <tr class="border-b">
                            <th class="px-4 py-2">ID</th>
                            <th class="px-4 py-2">Order Number</th>
                            <th class="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        {#each listData as item}
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-2">{item.id}</td>
                                <td class="px-4 py-2">{item.orderNum}</td>
                                <td class="px-4 py-2">{item.status}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <Dock />
</div>
