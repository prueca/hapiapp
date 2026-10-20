<script lang="ts">
    import { onMount } from 'svelte'
    import AccountListItem from './AccountListItem.svelte'
    import Skeleton from '../../../components/Skeleton.svelte'
    import Search from './Search.svelte'
    import SearchOptions from './SearchOptions.svelte'
    import accounts from '../accounts.svelte'
    import create from '../create.svelte'

    onMount(() => accounts.load())
</script>

<div class="px-4 md:px-0">
    <div class="mb-2 flex items-center justify-between">
        <span class="text-lg">Accounts</span>
        <div class="flex items-center">
            <button
                type="button"
                class="create-account btn btn-link btn-xs"
                onclick={() => create.toggle()}
            >
                <span class="-mt-0.5">&plus;</span>
                <span>Create</span>
            </button>
        </div>
    </div>
    <div class="overflow-hidden rounded bg-base-100">
        <!-- search components -->
        <Search />
        <SearchOptions />

        {#if accounts.loading}
            <!-- loading skeletons  -->
            <Skeleton class="h-36 w-full rounded-none" />
        {:else if accounts.error}
            <p class="p-4">Error: {accounts.error}</p>
        {:else}
            <!-- account list -->
            <div class="p-4">
                {#each accounts.filtered as item, idx}
                    <AccountListItem {item} isLast={idx === accounts.filtered.length - 1} />
                {/each}
            </div>
            {#if accounts.filtered.length < accounts.total}
                <div class="border-t border-gray-100 p-4 text-center">
                    <button
                        type="button"
                        class="btn btn-ghost btn-sm"
                        onclick={() => accounts.loadMore()}
                    >
                        Load More
                    </button>
                </div>
            {/if}
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .create-account {
        @apply flex items-center gap-2 rounded px-0 text-sm no-underline;
    }
</style>
