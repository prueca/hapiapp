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
        { id: 1, name: 'User_Alpha', status: 'Active' },
        { id: 2, name: 'User_Beta', status: 'Inactive' },
        { id: 3, name: 'User_Gamma', status: 'Pending' },
    ]
</script>

<div class="content-wrapper">
    <TopBar />
    <MerchantName />
    
    <div class="p-6 min-h-screen">
        <h1 class="text-2xl font-bold mb-6">Users</h1>
        
        <!-- Graph Section (Mock Bar Chart) -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold mb-4">User Activity Graph</h2>
            <div class="bg-gray-100 p-4 rounded-lg h-40 flex flex-col items-center justify-center">
                <div class="flex items-end gap-2 h-32">
                    {#each chartData as day}
                        <div class="bg-blue-500 w-8 rounded-t" style="height: {day.value}%"></div>
                    {/each}
                </div>
                <div class="flex gap-2 mt-2">
                    {#each chartData as day}
                        <span class="text-xs">{day.label}</span>
                    {/each}
                </div>
            </div>
        </div>

        <!-- List Section (Mock Data) -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold mb-4">User List</h2>
            <div class="border rounded-lg overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-gray-50">
                        <tr class="border-b">
                            <th class="px-4 py-2">ID</th>
                            <th class="px-4 py-2">Name</th>
                            <th class="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        {#each listData as item}
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-2">{item.id}</td>
                                <td class="px-4 py-2">{item.name}</td>
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
