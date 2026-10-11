<script lang="ts">
    import { onMount } from 'svelte'
    import Item from './Item.svelte'
    import state from '../deployment.listing.svelte'

    onMount(() => state.load())
</script>

{#if state.loading}
    <div class="state p-4">
        <span class="loading loading-sm loading-spinner"></span>
    </div>
{:else if state.error}
    <div class="state p-4">
        <p>{state.error}</p>
        <button class="btn btn-ghost btn-sm" onclick={() => state.load()}>Retry</button>
    </div>
{:else if !state.rows.length}
    <div class="state p-4">
        <p>No deployments match your filters.</p>
        {#if state.hasFilters}
            <button class="btn btn-ghost btn-sm" onclick={() => state.resetFilters()}>
                Clear filters
            </button>
        {/if}
    </div>
{:else}
    <div class="p-4">
        {#each state.rows as row (row.id)}
            <Item {row} />
        {/each}
    </div>

    {#if state.canLoadMore}
        <div class="load-more">
            <button class="btn rounded-lg btn-ghost btn-sm" onclick={() => state.loadMore()}>
                Load More
            </button>
        </div>
    {/if}
{/if}

<style lang="postcss">
    @reference 'tailwindcss';

    .state {
        @apply flex flex-col items-center justify-center gap-3 text-center text-gray-500;
    }

    .load-more {
        @apply border-t border-t-gray-100 p-4 text-center;
    }
</style>
