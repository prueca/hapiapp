<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import MerchantName from '../../components/MerchantName.svelte'
    import TopBar from '../../components/TopBar'
    import AccountDetail from './components/AccountDetail.svelte'
    import accounts, { type SortKey, type TypeFilter } from './accounts.state.svelte'

    const chartData = [
        { label: 'Mon', value: 100 },
        { label: 'Tue', value: 200 },
        { label: 'Wed', value: 150 },
        { label: 'Thu', value: 300 },
        { label: 'Fri', value: 250 }
    ]

    $effect(() => {
        accounts.load()
    })
</script>

<div class="content-wrapper">
    <TopBar />
    <MerchantName />

    <div class="min-h-screen p-6">
        <h1 class="mb-6 text-2xl font-bold">Accounts</h1>

        <div class="mb-8">
            <h2 class="mb-4 text-lg font-semibold">Account Activity Graph</h2>
            <div class="flex h-40 flex-col items-center justify-center rounded-lg bg-gray-100 p-4">
                <div class="flex h-32 items-end gap-2">
                    {#each chartData as day}
                        <div class="w-8 rounded-t bg-blue-500" style="height: {day.value}%"></div>
                    {/each}
                </div>
                <div class="mt-2 flex gap-2">
                    {#each chartData as day}
                        <span class="text-xs">{day.label}</span>
                    {/each}
                </div>
            </div>
        </div>

        <div class="mb-8">
            <div class="mb-4 flex flex-wrap items-center gap-2">
                <h2 class="me-auto text-lg font-semibold">Accounts</h2>

                <button class="btn btn-sm btn-primary" onclick={() => accounts.goToAddNew()}>
                    Add new
                </button>

                <input
                    type="text"
                    placeholder="Search name or ID..."
                    class="input max-w-50 grow"
                    bind:value={accounts.search}
                />

                <select class="input max-w-32" bind:value={accounts.typeFilter}>
                    <option value="all">All Types</option>
                    <option value="distributor">Distributor</option>
                    <option value="dealer">Dealer</option>
                    <option value="franchisee">Franchisee</option>
                </select>

                <select class="input max-w-32" bind:value={accounts.sortBy}>
                    <option value="name">Sort: Name</option>
                    <option value="account_type">Sort: Type</option>
                    <option value="id">Sort: ID</option>
                </select>

                <button
                    class="btn btn-sm"
                    onclick={() => (accounts.sortDir = accounts.sortDir === 'asc' ? 'desc' : 'asc')}
                >
                    <span>{accounts.sortDir === 'asc' ? 'Asc' : 'Desc'}</span>
                </button>
            </div>

            {#if accounts.loading}
                <div class="p-4 text-gray-400">Loading accounts...</div>
            {:else if accounts.error}
                <div class="p-4 text-red-500">{accounts.error}</div>
            {:else if accounts.visible.length === 0}
                <div class="p-4 text-gray-400">No accounts found.</div>
            {:else}
                <ul class="list">
                    {#each accounts.visible as merchant (merchant.id)}
                        <li>
                            <button class="row" onclick={() => accounts.openDetail(merchant)}>
                                <div class="row-main">
                                    <span class="row-name">{merchant.name.trim()}</span>
                                    <span class="row-sub">
                                        {merchant.account_type} · {merchant.company_code}
                                    </span>
                                </div>
                                <span class="row-arrow" aria-hidden="true">›</span>
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>

    {#if accounts.selected}
        <AccountDetail merchant={accounts.selected} onClose={accounts.closeDetail} />
    {/if}

    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .list {
        @apply divide-y overflow-hidden rounded-lg border;
    }

    .row {
        @apply flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-gray-50;
    }

    .row-main {
        @apply flex flex-col;
    }

    .row-name {
        @apply text-sm font-medium text-(--font-color);
    }

    .row-sub {
        @apply text-xs text-gray-400;
    }

    .row-arrow {
        @apply text-lg text-gray-300;
    }
</style>
