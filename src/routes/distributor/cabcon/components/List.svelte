<script lang="ts">
    import type { CabconRow, CabconMeta } from '$lib/types/cabcon'
    import Item from './Item.svelte'
    import state from '../cabcon.context.svelte'

    let { rows, meta }: { rows: CabconRow[]; meta: CabconMeta } = $props()

    $effect(() => {
        state.load(rows, meta)
    })
</script>

{#if !state.cabcons.length}
    <div class="state p-4">
        <p>No codes match your filters.</p>
        {#if state.hasFilters}
            <button class="btn btn-ghost btn-sm" onclick={() => state.resetFilters()}>
                Clear filters
            </button>
        {/if}
    </div>
{:else}
    <div class="p-4">
        {#each state.cabcons as cabcon (cabcon.id)}
            <Item {cabcon} />
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
