<script lang="ts">
    import { onMount } from 'svelte'
    import AccountListItem from './AccountListItem.svelte'
    import Skeleton from '../../../components/Skeleton.svelte'
    import Search from './Search.svelte'
    import SearchOptions from './SearchOptions.svelte'
    import search from '../search.context.svelte'

    onMount(() => search.submit())
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
        <!-- search -->
        <Search />
        <SearchOptions />

        {#if search.loading}
            <!-- loading skeletons  -->
            <Skeleton class="h-36 w-full rounded-none" />
        {:else}
            <!-- list -->
            <div class="p-4">
                {#each search.accounts as item}
                    <AccountListItem {item} />
                {/each}
            </div>
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
