<script lang="ts">
     import type { DeploymentRow, DeploymentMeta } from '$lib/types/deployment'
     import Item from './Item.svelte'
     import state from '../deployments.context.svelte'

     let { rows, meta }: { rows: DeploymentRow[]; meta: DeploymentMeta } = $props()

      $effect(() => {
           state.load(rows, meta)
      })
</script>

{#if !state.deployments.length}
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
          {#each state.deployments as deployment (deployment.id)}
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