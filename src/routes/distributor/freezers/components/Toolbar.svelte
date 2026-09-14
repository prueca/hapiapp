<script lang="ts">
    import Icon from '@iconify/svelte'
    import state from '../freezers.context.svelte'
    import Filters from './Filters.svelte'
</script>

<div class="border-b border-b-gray-100 p-4">
    <div class="flex gap-2">
        <div class="grow">
            <label class="input w-full rounded-l-md">
                <Icon icon="bytesize:search" width="20" />
                <input
                    type="search"
                    class="grow"
                    placeholder="Search freezers..."
                    bind:value={state.query}
                />
            </label>
        </div>

        <button type="button" class="btn rounded-md" onclick={() => (state.openFilters = true)}>
            <Icon icon="bi:filter" width="24" />
        </button>
    </div>
</div>

<Filters />

<style lang="postcss">
    @reference 'tailwindcss';
</style>
