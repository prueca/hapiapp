<script lang="ts">
    import Icon from '@iconify/svelte'
    import state from '../cabcon.context.svelte'
    import Filters from './Filters.svelte'
</script>

<div class="border-b border-b-gray-100 p-4">
    <div class="flex items-center justify-between gap-2">
        <button type="button" class="btn btn-ghost btn-sm" onclick={() => state.openCreate()}>
            <Icon icon="bi:plus-lg" width="16" />
            <span>Create</span>
        </button>

        <button
            type="button"
            class="btn rounded-md"
            aria-label="Filter and sort codes"
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
