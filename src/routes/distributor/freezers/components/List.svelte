<!--
  Freezers list body: empty-state or a windowed list of Item cards.

  Props: { freezers, codeMonths }. On mount it calls `state.load(...)` inside
  `untrack()` so the assigned data does not feed back into the reactivity graph.
  An `$effect` resets `visibleCount` whenever any filter/sort changes. This
  component mounts only in the page's `:then` branch, so `load` runs after the
  data has arrived. Renders "Load more" while `state.canLoadMore`.
-->
<script lang="ts">
    import { untrack } from 'svelte'
    import type { Freezer as FreezerType } from '$lib/types/freezer'
    import Item from './Item.svelte'
    import state from '../freezers.context.svelte'

    let { freezers, codeMonths = [] }: { freezers: FreezerType[]; codeMonths?: string[] } = $props()

    untrack(() => state.load(freezers, codeMonths))

     $effect(() => {
        state.query
        state.sort
        state.statusFilter
        state.typeFilter
        state.codeMonthFilter
        state.resetVisibleCount()
     })
</script>

{#if !state.sorted.length}
    <div class="state rounded-lg bg-white">
        <p>No freezers match your filters.</p>
        {#if state.hasFilters}
            <button class="btn btn-ghost btn-sm" onclick={() => state.resetFilters()}
                >Clear filters</button
            >
        {/if}
    </div>
{:else}
    <div class="list flex flex-col gap-3">
        {#each state.visible as freezer (freezer.id)}
            <Item {freezer} />
        {/each}

        {#if state.canLoadMore}
            <div class="center">
                <button class="btn btn-ghost" onclick={() => state.loadMore()}
                    >Load more</button
                >
            </div>
        {/if}
    </div>
{/if}

<style lang="postcss">
    @reference 'tailwindcss';

    .state {
        @apply flex flex-col items-center justify-center gap-3 py-16 text-center text-gray-400;
    }

    .center {
        @apply mt-4 flex justify-center;
    }
</style>
