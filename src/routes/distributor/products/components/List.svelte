<script lang="ts">
    import type { ProductRow, ProductMeta } from '$lib/types/product'
    import Item from './Item.svelte'
    import state from '../products.context.svelte'

    let { rows, meta }: { rows: ProductRow[]; meta: ProductMeta } = $props()

    $effect(() => {
        state.load(rows, meta)
    })
</script>

{#if !state.products.length}
    <div class="state p-4">
        <p>No products match your filters.</p>
        {#if state.hasFilters}
            <button class="btn btn-ghost btn-sm" onclick={() => state.resetFilters()}>
                Clear filters
            </button>
        {/if}
    </div>
{:else}
    <div class="p-4">
        {#each state.products as product (product.id)}
            <Item {product} />
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
