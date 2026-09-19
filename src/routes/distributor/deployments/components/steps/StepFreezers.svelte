<script lang="ts">
    import _ from 'lodash'
    import type { Freezer } from '$lib/types/freezer'
    import state from '../../deployments.context.svelte'

    let barcodeInput: HTMLInputElement

    const modelOf = (freezer: Freezer | null) =>
        freezer ? `${_.startCase(freezer.brand)} - ${_.startCase(freezer.model)}` : '—'

    const metaOf = (freezer: Freezer | null) =>
        [freezer?.capacity, freezer?.unit, freezer?.yearModel]
            .filter((v) => v !== null && v !== undefined && v !== '')
            .map(String)
            .join(' • ')

    const addFreezer = () => {
        const freezer = state.searchedFreezer

        if (!freezer || !state.searchedEligible || state.isSelected(freezer.id)) return

        state.toggleFreezer(freezer, true)
        state.clearSearchedFreezer()

        requestAnimationFrame(() => barcodeInput?.focus())
    }

    const removeFreezer = (freezer: Freezer) => state.toggleFreezer(freezer, false)
</script>

<fieldset class="fieldset">
      <legend class="label">Freezer barcode</legend>
    <div class="flex gap-2">
        <input
            bind:this={barcodeInput}
            type="text"
            class="input w-full"
            placeholder="Enter barcode"
            value={state.searchQuery}
            oninput={(e) => (state.searchQuery = e.currentTarget.value)}
            onkeydown={(e) =>
                e.key === 'Enter' && (e.preventDefault(), state.searchFreezerByBarcode())}
        />
        <button
            type="button"
            class="btn"
            disabled={state.searching || !state.searchQuery.trim()}
            onclick={() => state.searchFreezerByBarcode()}
        >
            {#if state.searching}Searching...{:else}Search{/if}
        </button>
        {#if state.searchedFreezer}
            <button
                type="button"
                class="btn btn-ghost btn-sm"
                onclick={() => state.clearSearchedFreezer()}
            >
                Clear
            </button>
        {/if}
    </div>

    {#if state.searching}
        <p class="hint">Searching for the freezer...</p>
    {:else if state.searchedFound && state.searchedFreezer}
        <div class="freezer-card" class:ineligible={!state.searchedEligible}>
            <div class="freezer-card-header">
                <div>
                    <div class="barcode">{state.searchedFreezer.barcode}</div>
                    <div class="model">{modelOf(state.searchedFreezer)}</div>
                    {#if metaOf(state.searchedFreezer)}
                        <div class="meta">{metaOf(state.searchedFreezer)}</div>
                    {/if}
                </div>
            </div>
            {#if !state.searchedEligible}
                <p class="ineligible-note">
                    Not available for deployment.
                    {#if state.searchedLastStatus}
                        Last status: {_.startCase(state.searchedLastStatus)}.{/if}
                </p>
            {:else if state.isSelected(state.searchedFreezer.id)}
                <p class="added-note">Added to selection.</p>
            {:else}
                <div class="card-action">
                    <button type="button" class="btn btn-sm" onclick={addFreezer}>
                        Add freezer
                    </button>
                </div>
            {/if}
        </div>
    {:else if state.searchedFound === false && !!state.searchQuery.trim()}
        <p class="hint">No freezer found for barcode “{_.trim(state.searchQuery)}”.</p>
    {/if}
</fieldset>

{#if state.selectedFreezers.length}
      <fieldset class="fieldset">
          <legend class="label">Selected freezers ({state.selectedFreezers.length})</legend>
        <div class="selected-list">
            {#each state.selectedFreezers as freezer (freezer.id)}
                <div class="selected-item">
                    <div>
                        <span class="selected-name">{freezer.barcode}</span>
                        <span class="selected-meta">
                            {modelOf(freezer)}
                            {#if metaOf(freezer)}
                                · {metaOf(freezer)}
                            {/if}
                        </span>
                    </div>
                    <button
                        type="button"
                        class="btn btn-ghost btn-xs"
                        onclick={() => removeFreezer(freezer)}
                    >
                        Remove
                    </button>
                </div>
            {/each}
        </div>
    </fieldset>
{/if}

{#if !state.selectedFreezers.length}
    <p class="hint">Search and add at least one freezer to continue.</p>
{/if}

<style lang="postcss">
    @reference 'tailwindcss';

     .fieldset {
         @apply mb-4;

         input {
             @apply rounded-lg;
         }
     }

     .hint {
         @apply mt-2 text-xs text-gray-500;
     }

     .freezer-card {
         @apply mt-3 flex flex-col gap-2 rounded-lg border border-gray-200 p-3;
     }

     .freezer-card.ineligible {
         @apply opacity-60;
     }

     .freezer-card-header {
         @apply flex items-start gap-3;
     }

     .barcode {
         @apply font-semibold;
     }

     .model {
         @apply text-sm text-gray-600;
     }

     .meta {
         @apply mt-0.5 text-xs text-gray-400;
     }

     .ineligible-note {
         @apply text-xs text-red-600;
     }

     .added-note {
         @apply text-xs text-green-600;
     }

     .card-action {
         @apply flex justify-end;
     }

     .selected-list {
         @apply flex flex-col gap-2;
     }

     .selected-item {
         @apply flex items-center justify-between gap-2 text-sm;
     }

     .selected-name {
         @apply font-medium;
     }

     .selected-meta {
         @apply text-xs text-gray-500;
     }
 </style>
