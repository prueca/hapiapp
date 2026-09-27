<!-- svelte-ignore a11y_label_has_associated_control -->

<script lang="ts">
    import state from '../products.context.svelte'
</script>

{#if state.openFilters}
    <div
        class="modal-open modal"
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        tabindex={-1}
        onkeydown={(e) => e.key === 'Escape' && state.closeFilters()}
        onclick={(e) => e.target === e.currentTarget && state.closeFilters()}
    >
        <div class="modal-box">
            <div class="heading">
                <p class="mb-4 text-lg font-bold">Sort and Filter Products...</p>
            </div>
            <div>
                <fieldset class="fieldset">
                    <label class="label">Sort</label>
                    <select
                        class="select w-full"
                        value={state.sort}
                        oninput={(e) =>
                            state.setSort(
                                (e.currentTarget as HTMLSelectElement).value as typeof state.sort
                            )}
                    >
                        {#each state.sortOptions as opt}
                            <option value={opt.value}>{opt.label}</option>
                        {/each}
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <label class="label">Category</label>
                    <select
                        class="select w-full"
                        value={state.filterCategory}
                        oninput={(e) =>
                            state.setCategoryFilter(
                                (e.currentTarget as HTMLSelectElement)
                                    .value as typeof state.filterCategory
                            )}
                    >
                        <option value="all">All Categories</option>
                        {#each state.categoryOptions as opt}
                            <option value={opt.value}>{opt.label}</option>
                        {/each}
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <label class="label">Packaging</label>
                    <select
                        class="select w-full"
                        value={state.filterPackaging}
                        oninput={(e) =>
                            state.setPackagingFilter(
                                (e.currentTarget as HTMLSelectElement)
                                    .value as typeof state.filterPackaging
                            )}
                    >
                        <option value="all">All Packagings</option>
                        {#each state.packagingOptions as opt}
                            <option value={opt.value}>{opt.label}</option>
                        {/each}
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <label class="label">Enlisted For</label>
                    <select
                        class="select w-full"
                        value={state.filterEnlistedFor}
                        oninput={(e) =>
                            state.setEnlistedForFilter(
                                (e.currentTarget as HTMLSelectElement)
                                    .value as typeof state.filterEnlistedFor
                            )}
                    >
                        <option value="all">All</option>
                        {#each state.enlistedForOptions as opt}
                            <option value={opt.value}>{opt.label}</option>
                        {/each}
                    </select>
                </fieldset>
            </div>
            <div class="modal-action">
                <button class="close-btn btn" onclick={() => state.resetFilters()}>Clear</button>
                <button class="btn" onclick={() => state.closeFilters()}>Done</button>
            </div>
        </div>
    </div>
{/if}

<style lang="postcss">
    @reference 'tailwindcss';

    .fieldset {
        @apply not-last:mb-4;
    }

    .close-btn {
        @apply cursor-pointer rounded-lg border-none;
    }
</style>
