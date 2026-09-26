<!-- svelte-ignore a11y_label_has_associated_control -->

<script lang="ts">
    import Icon from '@iconify/svelte'
    import state from '../cabcon.context.svelte'
</script>

<div class="cabcon-form">
    <div class="heading">
        <h2 class="title">
            {#if state.isCreate}
                New Code of the Month
            {:else}
                Edit Code of the Month
            {/if}
        </h2>
        {#if !state.isCreate}
            <p class="subtitle">Updating “{state.editing?.codeMonth ?? ''}”</p>
        {/if}
    </div>

    <form onsubmit={(e) => e.preventDefault()}>
        <fieldset class="fieldset">
            <label class="label" for="code-month">Code Month</label>
            <input
                id="code-month"
                type="text"
                class="input w-full"
                placeholder="e.g. CABCONJAN2026"
                bind:value={state.newCodeMonth}
            />
        </fieldset>

        <fieldset class="fieldset">
            <label class="label" for="close-date">Close Date</label>
            <input
                id="close-date"
                type="date"
                class="input w-full"
                bind:value={state.newCloseDate}
            />
            <p class="hint">Report submissions open until this date.</p>
        </fieldset>

        {#if state.submitError}
            <p class="error">{state.submitError}</p>
        {/if}

        <div class="modal-action">
            <button
                type="button"
                class="close-btn btn btn-ghost"
                onclick={() => state.cancelForm()}
            >
                Cancel
            </button>
            <button
                type="submit"
                class="btn"
                disabled={state.submitting || !state.newCodeMonth.trim() || !state.newCloseDate}
                onclick={() => state.submit()}
            >
                {#if state.submitting}
                    {state.isCreate ? 'Creating...' : 'Saving...'}
                {:else}
                    {#if state.isCreate}
                        <Icon icon="bi:plus-lg" width="16" />
                    {/if}
                    {state.isCreate ? 'Create' : 'Update'}
                {/if}
            </button>
        </div>
    </form>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .cabcon-form {
        @apply mx-auto max-w-md;
    }

    .heading {
        @apply mb-4;
    }

    .title {
        @apply text-lg font-bold;
    }

    .subtitle {
        @apply text-xs text-gray-500;
    }

    .fieldset {
        @apply not-last:mb-4;

        .input {
            @apply rounded-lg;
        }
    }

    .hint {
        @apply mt-1 text-xs text-gray-500;
    }

    .modal-action {
        @apply mt-6 flex justify-end gap-2;
    }

    .error {
        @apply mb-4 rounded-lg bg-red-50 p-2 text-sm text-red-600;
    }
</style>
