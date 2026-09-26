<!-- svelte-ignore a11y_label_has_associated_control -->

<script lang="ts">
    import _ from 'lodash'
    import state from '../cabcon.context.svelte'
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
                <p class="mb-4 text-lg font-bold">Sort and Filter Codes...</p>
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
                    <label class="label">Status</label>
                    <select
                        class="select w-full"
                        value={state.filterStatus}
                        oninput={(e) =>
                            state.setStatusFilter(
                                (e.currentTarget as HTMLSelectElement)
                                    .value as typeof state.filterStatus
                            )}
                    >
                        {#each state.statusOptions as opt}
                            <option value={opt.value}>{opt.label}</option>
                        {/each}
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <label class="label">Code Month</label>
                    <select
                        class="select w-full"
                        value={state.filterCodeMonth}
                        oninput={(e) =>
                            state.setCodeMonthFilter((e.currentTarget as HTMLSelectElement).value)}
                    >
                        <option value="all">All Code Months</option>
                        {#each state.meta.codeMonthOptions as code}
                            <option value={code}>{_.upperFirst(code)}</option>
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
