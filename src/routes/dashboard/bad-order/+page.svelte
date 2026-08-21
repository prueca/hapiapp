<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import MerchantName from '../../components/MerchantName.svelte'
    import TopBar from '../../components/TopBar'

    // Mock Data
    const chartData = [
        { label: 'Mon', value: 20 },
        { label: 'Tue', value: 30 },
        { label: 'Wed', value: 10 },
        { label: 'Thu', value: 40 },
        { label: 'Fri', value: 50 },
    ]

    const listData = [
        { id: 1, orderNum: 'ERR-001', reason: 'Stock Out' },
        { id: 2, orderNum: 'ERR-002', reason: 'Address Missing' },
        { id: 3, orderNum: 'ERR-003', reason: 'Invalid Payment' },
    ]
</script>

<div class="content-wrapper">
    <TopBar />
    <MerchantName />
    
    <div class="p-6 min-h-screen">
        <h1 class="text-2xl font-bold mb-6">Bad Orders</h1>
        
        <!-- Graph Section (Mock Bar Chart) -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold mb-4">Failure Rate Graph</h2>
            <div class="bg-gray-100 p-4 rounded-lg h-40 flex items-center justify-center">
                <p class="text-gray-500">[Bar Chart Placeholder - Data: {chartData}]</p>
            </div>
        </div>

        <!-- List Section (Mock Data) -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold mb-4">Bad Orders List</h2>
            <div class="border rounded-lg overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-gray-50">
                        <tr class="border-b">
                            <th class="px-4 py-2">ID</th>
                            <th class="px-4 py-2">Order Number</th>
                            <th class="px-4 py-2">Reason</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        {#each listData as item}
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-2">{item.id}</td>
                                <td class="px-4 py-2">{item.orderNum}</td>
                                <td class="px-4 py-2">{item.reason}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <Dock />
</div>
