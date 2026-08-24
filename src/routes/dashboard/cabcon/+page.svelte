<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import MerchantName from '../../components/MerchantName.svelte'
    import TopBar from '../../components/TopBar'

    // Mock Data for Cabcon
    const currentCabcon = {
        code: '2020JANCAB',
        startDate: '2020-01-01',
        endDate: '2020-12-31'
    }

    const historyList = [
        { id: 1, code: '2019DECAB', startDate: '2019-12-01', endDate: '2019-12-31' },
        { id: 2, code: '2020JAN', startDate: '2020-01-01', endDate: '2020-01-31' },
    ]
</script>

<div class="content-wrapper">
    <TopBar />
    <MerchantName />
    
    <div class="p-6 min-h-screen">
        <h1 class="text-2xl font-bold mb-6">Cabcon (Code of the Month)</h1>
        
        <!-- Information Section -->
        <div class="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 class="text-xl font-bold mb-4">Current Active Cabcon</h2>
            <div class="flex flex-col gap-2">
                <p><strong class="font-bold">Code:</strong> {currentCabcon.code}</p>
                <p><strong class="font-bold">Start Date:</strong> {currentCabcon.startDate}</p>
                <p><strong class="font-bold">End Date:</strong> {currentCabcon.endDate}</p>
            </div>
        </div>

        <!-- History List -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold mb-4">Historical Cabcons</h2>
            <div class="border rounded-lg overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-gray-50">
                        <tr class="border-b">
                            <th class="px-4 py-2">Code</th>
                            <th class="px-4 py-2">Start Date</th>
                            <th class="px-4 py-2">End Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        {#each historyList as item}
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-2">{item.code}</td>
                                <td class="px-4 py-2">{item.startDate}</td>
                                <td class="px-4 py-2">{item.endDate}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <Dock />
</div>
