<script lang="ts">
    import state from '../cabcon.context.svelte'
</script>

{#if state.pendingDelete}
    <div
        class="modal-open modal"
        role="dialog"
        aria-modal="true"
        aria-label="Delete code of the month"
        tabindex={-1}
        onkeydown={(e) => e.key === 'Escape' && state.cancelDelete()}
        onclick={(e) => e.target === e.currentTarget && state.cancelDelete()}
    >
        <div class="modal-box">
            <div class="heading">
                <p class="mb-4 text-lg font-bold">Delete Code of the Month</p>
            </div>

            {#if state.deleteError}
                <p class="error mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">
                    {state.deleteError}
                </p>
            {:else}
                <p class="message">
                    Are you sure you want to delete “{state.pendingDelete.codeMonth}”? Its reported
                    freezers are removed as well.
                </p>
            {/if}

            <div class="modal-action">
                <button class="close-btn btn" onclick={() => state.cancelDelete()}> Cancel </button>
                <button
                    class="btn btn-error"
                    disabled={state.isDeleting(state.pendingDelete.id)}
                    onclick={() => state.confirmDelete()}
                >
                    {#if state.isDeleting(state.pendingDelete.id)}
                        <span class="loading loading-sm loading-spinner"></span>
                    {:else}
                        Delete
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}

<style lang="postcss">
    @reference 'tailwindcss';

    .message {
        @apply text-gray-600;
    }

    .close-btn {
        @apply cursor-pointer rounded-lg border-none;
    }
</style>
