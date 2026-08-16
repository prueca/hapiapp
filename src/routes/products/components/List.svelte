<script lang="ts">
    import Item from './Item.svelte'
    import Toolbar from './Toolbar.svelte'
    import state from '../products.state.svelte'
</script>

<div class="mb-8">
    <div class="section-title">
        <span class="text-lg">Products</span>
        {#if state.items.length}
            <span class="count">{state.sorted.length} of {state.items.length}</span>
        {/if}
    </div>

    <Toolbar />

    {#if state.loading}
        <div class="state">
            <span class="loading loading-spinner" aria-label="loading"></span>
            <p>Loading products…</p>
        </div>
    {:else if state.error}
        <div class="state error">
            <p>{state.error}</p>
            <button class="btn btn-ghost btn-sm" onclick={state.load}>Retry</button>
        </div>
    {:else if !state.sorted.length}
        <div class="state">
            <p>No products match your filters.</p>
            {#if state.hasFilters}
                <button class="btn btn-ghost btn-sm" onclick={state.resetFilters}
                    >Clear filters</button
                >
            {/if}
        </div>
    {:else}
        <div class="list">
            {#each state.sorted as product (product.name)}
                <Item {product} />
            {/each}
        </div>
    {/if}
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section-title {
        @apply mb-4 flex items-center justify-between;
    }

    .count {
        @apply text-sm text-gray-400;
    }

    .list {
        @apply grid grid-cols-1 gap-4 md:grid-cols-2;
    }

    .state {
        @apply flex flex-col items-center justify-center gap-3 py-16 text-center text-gray-400;

        &.error p {
            @apply text-(--c1);
        }
    }
</style>
