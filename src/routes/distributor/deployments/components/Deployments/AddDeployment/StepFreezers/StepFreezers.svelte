<script lang="ts">
    import FreezerSearch from './FreezerSearch.svelte'
    import FreezerSearchResult from './FreezerSearchResult.svelte'
    import FreezerAdded from './FreezerAdded.svelte'
    import deployment from '../../../../deployment.svelte'

    const next = () => {
        deployment.setCurrentStep(2)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
</script>

<div class="flex flex-col gap-4 bg-(--c6) p-4 md:gap-4">
    <!-- search freezer -->
    <div class="section bg-base-100">
        <FreezerSearch />
        <FreezerSearchResult />
    </div>

    <!-- freezers added -->
    <div class="section bg-base-100">
        <div class="mb-2">
            <div class="label">Freezers added</div>
            <!-- <div class="text-xs text-gray-400">List of items set for deployment</div> -->
        </div>
        {#if deployment.freezers.length === 0}
            <div class="text-gray-400 italic">Search and add freezers to your deployment</div>
        {:else}
            <div class="mb-4 overflow-hidden rounded">
                {#each deployment.freezers as freezer (freezer.id)}
                    <FreezerAdded {freezer} />
                {/each}
            </div>
        {/if}
        <div class="flex flex-row-reverse gap-2 text-right">
            {#if deployment.freezers.length > 0}
                <button type="button" class="btn btn-ghost btn-sm" onclick={next}>Next</button>
            {/if}
            <button type="button" class="btn btn-ghost btn-sm">Cancel</button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section {
        @apply rounded p-4 shadow;
    }

    .label {
        @apply text-sm;
    }

    .btn {
        @apply no-underline;
    }
</style>
