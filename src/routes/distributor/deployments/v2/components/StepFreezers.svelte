<script lang="ts">
    import FreezerSearch from './FreezerSearch.svelte'
    import FreezerSearchResult from './FreezerSearchResult.svelte'
    import FreezerAdded from './FreezerAdded.svelte'
</script>

<div class="flex flex-col gap-2 md:gap-4">
    <!-- search freezer -->
    <div class="section bg-base-100">
        <div class="mb-2">
            <div class="mb-1 text-lg">Search Freezer</div>
        </div>
        <FreezerSearch />
        <FreezerSearchResult />
    </div>

    <!-- freezers added -->
    <div class="section bg-base-100">
        <div class="mb-4">
            <div class="mb-1 text-lg">Freezers Added</div>
            <div class="text-xs text-gray-400">Select atleast one freezer to proceed</div>
        </div>
        <div class="mb-4 overflow-hidden rounded-lg">
            <FreezerAdded />
            <FreezerAdded />
            <FreezerAdded />
        </div>
        <div class="flex flex-row-reverse gap-2 text-right">
            <button type="button" class="next-btn btn">Next</button>
            <button type="button" class="cancel-btn btn">Cancel</button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section {
        @apply rounded-lg p-4 shadow;
    }

    .next-btn,
    .cancel-btn {
        @apply w-20 rounded-lg;
    }
</style>
