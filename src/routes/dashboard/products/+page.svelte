<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import MerchantName from '../../components/MerchantName.svelte'
    import TopBar from '../../components/TopBar'

    // Mock Data
    const chartData = [
        { label: 'Mon', value: 100 },
        { label: 'Tue', value: 200 },
        { label: 'Wed', value: 150 },
        { label: 'Thu', value: 300 },
        { label: 'Fri', value: 250 },
    ]

    const listData = [
        { id: 1, name: 'Product_Apple', stock: 50 },
        { id: 2, name: 'Product_Banana', stock: 120 },
        { id: 3, name: 'Product_Orange', stock: 0 },
    ]
</script>

<div class="content-wrapper">
    <TopBar />
    <MerchantName />
    
    <div class="p-6 min-h-screen">
        <h1 class="text-2xl font-bold mb-6">Products</h1>
        
        <!-- Graph Section (Mock Bar Chart) -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold mb-4">Inventory Graph</h2>
            <div class="bg-gray-100 p-4 rounded-lg h-40 flex items-center justify-center">
                <p class="text-gray-500">[Bar Chart Placeholder - Data: {chartData}]</p>
            </div>
        </div>

        <!-- List Section (Mock Data) -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold mb-4">Products List</h2>
            <div class="border rounded-lg overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-gray-50">
                        <tr class="border-b">
                            <th class="px-4 py-2">ID</th>
                            <th class="px-4 py-2">Name</th>
                            <th class="px-4 py-2">Stock</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        {#each listData as item}
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-2">{item.id}</td>
                                <td class="px-4 py-2">{item.name}</td>
                                <td class="px-4 py-2">{item.stock}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <Dock />
</div>
