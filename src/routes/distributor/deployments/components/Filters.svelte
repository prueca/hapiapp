<!-- svelte-ignore a11y_label_has_associated_control -->

<script lang="ts">
    import {
        ORIGIN_STATUS_OPTIONS,
        DESTINATION_STATUS_OPTIONS,
        type OriginStatusFilter,
        type DestinationStatusFilter
    } from '$lib/config/deployment.status'
    import state from '../deployment.listing.svelte'
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
                <p class="mb-4 text-lg font-bold">Sort and Filter Deployments...</p>
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
                    <label class="label">Origin Status</label>
                    <select
                        class="select w-full"
                        value={state.filterStatus}
                        oninput={(e) =>
                            state.setStatusFilter(
                                (e.currentTarget as HTMLSelectElement).value as OriginStatusFilter
                            )}
                    >
                        {#each ORIGIN_STATUS_OPTIONS as opt}
                            <option value={opt.value}>{opt.label}</option>
                        {/each}
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <label class="label">Destination Status</label>
                    <select
                        class="select w-full"
                        value={state.filterDestinationStatus}
                        oninput={(e) =>
                            state.setDestinationStatusFilter(
                                (e.currentTarget as HTMLSelectElement)
                                    .value as DestinationStatusFilter
                            )}
                    >
                        {#each DESTINATION_STATUS_OPTIONS as opt}
                            <option value={opt.value}>{opt.label}</option>
                        {/each}
                    </select>
                </fieldset>

                <fieldset class="fieldset">
                    <label class="label flex items-center justify-between">
                        <span>Overdue only</span>
                        <input
                            type="checkbox"
                            class="toggle toggle-primary toggle-sm"
                            checked={state.overdueOnly}
                            onchange={(e) =>
                                state.toggleOverdue((e.currentTarget as HTMLInputElement).checked)}
                        />
                    </label>
                </fieldset>
            </div>
            <div class="modal-action">
                <button class="btn" onclick={() => state.resetFilters()}>Clear</button>
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
</style>
