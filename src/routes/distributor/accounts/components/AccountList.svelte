<script lang="ts">
    import { onMount } from 'svelte'
    import AccountListItem from './AccountListItem.svelte'
    import Skeleton from '../../../components/Skeleton.svelte'
    import Search from './Search.svelte'
    import SearchOptions from './SearchOptions.svelte'
    import accounts from '../accounts.context.svelte'

    onMount(() => accounts.load())
</script>

<div class="px-4">
    <div class="mb-2 flex items-center justify-between">
        <span class="text-lg">Accounts</span>
        <div class="flex items-center">
            <button type="button" class="delete-account btn btn-ghost btn-xs">
                <span>&minus;</span>
                <span>Delete</span>
            </button>
            <div class="divider-sm divider mx-0 mt-0.5 divider-horizontal h-5"></div>
            <button type="button" class="create-account btn btn-ghost btn-xs">
                <span>&plus;</span>
                <span>Create</span>
            </button>
        </div>
    </div>
    <div class="overflow-hidden rounded-lg bg-white">
        <!-- search components -->
        <Search />
        <SearchOptions />

        {#if accounts.loading}
            <!-- loading skeletons  -->
            <Skeleton class="h-36 w-full rounded-none" />
        {:else}
            <!-- account list -->
            <div class="p-4">
                {#each accounts.filtered as item}
                    <AccountListItem {item} />
                {/each}
            </div>
            {#if accounts.filtered.length < accounts.total}
                <div class="border-t border-gray-100 p-4 text-center">
                    <button
                        type="button"
                        class="btn rounded-lg btn-ghost btn-sm"
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

    .create-account,
    .delete-account {
        @apply flex items-center gap-2 rounded-md text-sm;
    }
</style>
