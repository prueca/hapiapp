<!--
  Filters modal for the freezers list.

  Rendered only while `state.openFilters`; a daisyUI modal with Status, Type,
  Code Month, and Sort selects bound to the state singleton, plus Clear
  (`state.resetFilters`) and Done (`state.closeFilters`). Closes on Escape or a
  backdrop click. The "All Code Months" option is the 'all' value.
-->
<script lang="ts">
    import state from '../freezers.context.svelte'
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
            <p class="text-xl font-bold">Filters</p>

            <div class="field">
                <span class="field-label">Status</span>
                <select class="select w-full" bind:value={state.statusFilter}>
                    {#each state.statusFilterOptions as opt}
                        <option value={opt.value}>{opt.label}</option>
                    {/each}
                </select>
            </div>

            <div class="field">
                <span class="field-label">Type</span>
                <select class="select w-full" bind:value={state.typeFilter}>
                    {#each state.typeFilterOptions as opt}
                        <option value={opt.value}>{opt.label}</option>
                    {/each}
                </select>
            </div>

            <div class="field">
                <span class="field-label">Code Month</span>
                <select class="select w-full" bind:value={state.codeMonthFilter}>
                    {#each state.codeMonthFilterOptions as opt}
                        <option value={opt}>{opt === 'all' ? 'All Code Months' : opt}</option>
                    {/each}
                </select>
            </div>

            <div class="field">
                <span class="field-label">Sort</span>
                <select class="select w-full" bind:value={state.sort}>
                    {#each state.sortOptions as opt}
                        <option value={opt.value}>{opt.label}</option>
                    {/each}
                </select>
            </div>

            <div class="modal-action">
                <button class="btn btn-ghost" onclick={() => state.resetFilters()}>Clear</button>
                <button class="btn" onclick={() => state.closeFilters()}>Done</button>
            </div>
        </div>
    </div>
{/if}

<style lang="postcss">
    @reference 'tailwindcss';

    .field {
        @apply flex flex-col gap-1;
    }

    .field-label {
        @apply text-xs font-medium text-gray-500;
    }

    .modal-box {
        @apply flex flex-col gap-3 p-6;
    }
</style>
