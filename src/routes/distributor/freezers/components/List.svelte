<script lang="ts">
    import { untrack } from 'svelte'
    import type { Freezer as FreezerType } from '$lib/types/freezer'
    import Item from './Item.svelte'
    import state from '../freezers.context.svelte'

    let { freezers }: { freezers: FreezerType[] } = $props()

    untrack(() => state.load(freezers))

    $effect(() => {
        state.query
        state.sort
        state.statusFilter
        state.resetVisibleCount()
    })
</script>

{#if !state.sorted.length}
    <div class="state p-4">
        <p>No freezers match your filters.</p>
        {#if state.hasFilters}
            <button class="btn btn-ghost btn-sm" onclick={() => state.resetFilters()}>
                Clear filters
            </button>
        {/if}
    </div>
{:else}
    <div class="p-4">
        {#each state.visible as freezer (freezer.id)}
            <Item {freezer} />
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
        @apply flex flex-col items-center justify-center gap-3 text-center text-gray-400;
    }

    .load-more {
        @apply border-t border-gray-100 p-4 text-center;
    }
</style>
