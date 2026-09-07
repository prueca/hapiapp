<!-- svelte-ignore a11y_label_has_associated_control -->

<script lang="ts">
    import state from '../freezers.context.svelte'
</script>

{#if state.openCreate}
    <div
        class="modal-open modal"
        role="dialog"
        aria-modal="true"
        aria-label="Create freezer"
        tabindex={-1}
        onkeydown={(e) => e.key === 'Escape' && state.closeCreate()}
        onclick={(e) => e.target === e.currentTarget && state.closeCreate()}
    >
        <div class="modal-box">
            <div class="heading">
                <p class="mb-4 text-lg font-bold">Create Freezer...</p>
            </div>
            <form onsubmit={(e) => e.preventDefault()}>
                <div>
                      <fieldset class="fieldset">
                          <label class="label">Model</label>
                          <select class="select w-full" bind:value={state.newModel}>
                              <option value="" disabled selected>Pick model</option>
                              {#each state.modelOptions as model}
                                  <option value={model}>{model}</option>
                              {/each}
                          </select>
                      </fieldset>

                    <fieldset class="fieldset">
                        <label class="label">Brand</label>
                        <select class="select w-full" bind:value={state.newBrand}>
                            <option value="" disabled selected>Pick brand</option>
                            {#each state.brandOptions as brand}
                                <option value={brand}>{brand}</option>
                            {/each}
                        </select>
                    </fieldset>

                    <fieldset class="fieldset">
                        <label class="label">Capacity (cu)</label>
                        <select class="select w-full" bind:value={state.newCapacity}>
                            <option value="" disabled selected>Pick capacity</option>
                            {#each state.capacityOptions as cap}
                                <option value={cap}>{cap}</option>
                            {/each}
                        </select>
                    </fieldset>

                      <fieldset class="fieldset">
                          <label class="label">Year Model</label>
                          <select class="select w-full" bind:value={state.newYearModel}>
                              <option value="" disabled selected>Pick year model</option>
                              {#each state.yearModelOptions as year}
                                  <option value={year}>{year}</option>
                              {/each}
                          </select>
                      </fieldset>

                    <fieldset class="fieldset">
                        <label class="label">Barcode</label>
                        <input
                            type="text"
                            class="input w-full"
                            placeholder="Enter barcode"
                            bind:value={state.newBarcode}
                        />
                    </fieldset>
                </div>

                {#if state.error}
                    <p class="error">{state.error}</p>
                {/if}

                <div class="modal-action">
                    <button type="button" class="close-btn btn" onclick={() => state.closeCreate()}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn"
                        disabled={state.submitting}
                        onclick={() => state.submitCreate()}
                    >
                        {#if state.submitting}Saving...{:else}Create{/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style lang="postcss">
    @reference 'tailwindcss';

    .fieldset {
        @apply not-last:mb-4;

        input,
        select {
            @apply rounded-lg;
        }
    }

    .error {
        @apply mb-4 rounded-lg bg-red-50 p-2 text-sm text-red-600;
    }

    .close-btn {
        @apply cursor-pointer rounded-lg border-none;
    }
</style>
