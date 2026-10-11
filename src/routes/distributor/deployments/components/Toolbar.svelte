<script lang="ts">
    import Icon from '@iconify/svelte'
    import state from '../deployment.listing.svelte'

    let { onCreate }: { onCreate: () => void } = $props()
</script>

<div class="toolbar">
    <button type="button" class="btn btn-ghost btn-sm" onclick={onCreate}>
        <Icon icon="bi:plus-lg" width="16" />
        <span>Create</span>
    </button>

    <div class="grow">
        <label class="input w-full">
            <Icon icon="bytesize:search" width="20" />
            <input
                type="search"
                class="grow"
                placeholder="Search destination name or address..."
                bind:value={state.queryInput}
                oninput={() => state.onSearchInput()}
            />
        </label>
    </div>

    <button
        type="button"
        class="btn"
        aria-label="Filter deployments"
        aria-pressed={state.hasFilters}
        class:has-filters={state.hasFilters}
        onclick={() => (state.openFilters = true)}
    >
        <Icon icon="bi:filter" width="24" />
    </button>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .toolbar {
        @apply flex gap-2 border-b border-b-gray-100 p-4;
    }

    .btn.has-filters {
        @apply bg-(--c1) text-white;
    }
</style>
