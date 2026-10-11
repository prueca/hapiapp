<script lang="ts">
    import moment from 'moment'
    import state from '../../deployments.create.svelte'

    const statusLabelOf = (value: string) =>
        state.originStatusOptions.find((o) => o.value === value)?.label ?? value

    const displayDate = $derived(
        moment(state.deploymentDate, 'YYYY-MM-DD').format('MMM-DD-YYYY, ddd')
    )
</script>

<fieldset class="fieldset">
    <legend class="label">Deployment date</legend>
    <input
        type="date"
        class="input w-full"
        value={state.deploymentDate}
        oninput={(e) => (state.deploymentDate = e.currentTarget.value)}
    />
</fieldset>

<fieldset class="fieldset">
    <legend class="label">Status</legend>

    {#if state.allowedOriginStatus}
        <select
            class="input w-full"
            value={state.originStatus}
            oninput={(e) =>
                (state.originStatus = (e.currentTarget as HTMLSelectElement)
                    .value as typeof state.originStatus)}
        >
            {#each state.originStatusOptions as opt (opt.value)}
                <option value={opt.value} disabled={opt.value !== state.allowedOriginStatus}>
                    {opt.label}
                </option>
            {/each}
        </select>
        <p class="hint">Status is fixed by the selected destination type.</p>
    {:else}
        <p class="hint">Select a destination account to resolve the deployment status.</p>
    {/if}
</fieldset>

{#if state.selectedFreezers.length || state.destinationAccount}
    <fieldset class="fieldset">
        <legend class="label">Summary</legend>
        <div class="summary">
            <div class="summary-row">
                <span class="summary-label">Freezers</span>
                <span>{state.selectedFreezers.length}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Destination</span>
                <span>{state.destinationAccount?.name ?? '—'}</span>
            </div>
            {#if state.allowedOriginStatus}
                <div class="summary-row">
                    <span class="summary-label">Status</span>
                    <span>{statusLabelOf(state.originStatus)}</span>
                </div>
            {/if}
            <div class="summary-row">
                <span class="summary-label">Date</span>
                <span>{displayDate}</span>
            </div>
        </div>
    </fieldset>
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

    .summary {
        @apply flex flex-col gap-2 rounded-lg border border-gray-200 p-3 text-sm;
    }

    .summary-row {
        @apply flex justify-between;
    }

    .summary-label {
        @apply text-gray-500;
    }
</style>
