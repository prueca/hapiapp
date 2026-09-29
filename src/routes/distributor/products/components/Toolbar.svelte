<script lang="ts">
    import Icon from '@iconify/svelte'
    import state from '../products.context.svelte'
    import Filters from './Filters.svelte'
</script>

<div class="border-b border-b-gray-100 p-4">
    <div class="flex items-center gap-2">
        <button type="button" class="btn btn-ghost btn-sm" onclick={() => state.openCreate()}>
            <Icon icon="bi:plus-lg" width="16" />
            <span>Create</span>
        </button>

        <div class="grow">
            <label class="input w-full rounded-lg">
                <Icon icon="bytesize:search" width="20" />
                <input
                    type="search"
                    class="grow"
                    placeholder="Search name or category..."
                    aria-label="Search products by name or category"
                    bind:value={state.search}
                    oninput={() => state.onSearchInput()}
                />
            </label>
        </div>

        <button
            type="button"
            class="btn rounded-md"
            aria-label="Filter and sort products"
            onclick={() => (state.openFilters = true)}
        >
            <Icon icon="bi:filter" width="24" />
        </button>
    </div>
</div>

<Filters />

<style lang="postcss">
    @reference 'tailwindcss';
</style>
