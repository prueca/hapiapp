<script lang="ts">
     import { untrack } from 'svelte'
     import type { DeploymentRow } from '$lib/types/deployment'
     import Item from './Item.svelte'
     import state from '../deployments.context.svelte'

     let { rows }: { rows: DeploymentRow[] } = $props()

     untrack(() => state.load(rows))

    $effect(() => {
       state.query
       state.sort
       state.filterStatus
       state.resetVisibleCount()
    })
</script>

{#if !state.sorted.length}
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
        {#each state.visible as deployment (deployment.id)}
              <Item {deployment} />
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
