<script lang="ts">
    import state from '../deployments.context.svelte'
</script>

{#if state.editingStatusDeployment}
    <div
        class="modal-open modal"
        role="dialog"
        aria-modal="true"
        aria-label="Update deployment status"
        tabindex={-1}
        onkeydown={(e) => e.key === 'Escape' && state.closeEditStatus()}
        onclick={(e) => e.target === e.currentTarget && state.closeEditStatus()}
    >
        <div class="modal-box">
            <div class="heading">
                <p class="mb-4 text-lg font-bold">Update Deployment Status</p>
            </div>

            {#if state.statusUpdateError}
                <p class="error mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">
                    {state.statusUpdateError}
                </p>
            {:else}
                <fieldset class="fieldset">
                    <legend class="label">Deployment status</legend>
                    <select
                        class="select w-full"
                        value={state.editStatus}
                        oninput={(e) =>
                            (state.editStatus = (e.currentTarget as HTMLSelectElement)
                                .value as typeof state.editStatus)}
                    >
                        {#each state.statusChangeOptions as opt}
                            <option value={opt.value}>{opt.label}</option>
                        {/each}
                    </select>
                </fieldset>
            {/if}

            <div class="modal-action">
                <button class="close-btn btn" onclick={() => state.closeEditStatus()}>
                    Cancel
                </button>
                <button
                    class="btn"
                    disabled={state.isUpdatingStatus(state.editingStatusDeployment.id)}
                    onclick={() => state.submitEditStatus()}
                >
                    {#if state.isUpdatingStatus(state.editingStatusDeployment.id)}
                        <span class="loading loading-sm loading-spinner"></span>
                    {:else}
                        Save
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}

<style lang="postcss">
    @reference 'tailwindcss';

    .fieldset {
        @apply mb-4;

        input,
        select {
            @apply rounded-lg;
        }
    }

    .close-btn {
        @apply cursor-pointer rounded-lg border-none;
    }
</style>
