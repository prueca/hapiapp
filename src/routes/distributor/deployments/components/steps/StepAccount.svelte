<script lang="ts">
    import _ from 'lodash'
    import state from '../../deployments.context.svelte'

    const accountOptions = [
        { value: 'dealer', label: 'Dealer' },
        { value: 'hapistore', label: 'Hapistore' }
    ] as const

    const chooseAccount = (account: (typeof state.accountResults)[number]) =>
        state.selectAccount(account)

    const clearSelectedAccount = () => state.clearDesignation()

    const selectType = (type: 'dealer' | 'hapistore') => state.setAccountType(type)

    const onAccountQueryInput = _.debounce(() => state.searchAccounts(), 250)

    const clearAccountQuery = () => {
        state.accountQuery = ''
        state.accountResults = []
    }
</script>

<fieldset class="fieldset">
    <legend class="legend">Designation account</legend>

    <div class="type-toggle" role="radiogroup" aria-label="Account type">
        {#each accountOptions as option (option.value)}
            <button
                type="button"
                role="radio"
                aria-checked={state.accountType === option.value}
                class="type-btn"
                class:active={state.accountType === option.value}
                onclick={() => selectType(option.value)}
            >
                {option.label}
            </button>
        {/each}
    </div>

    <div class="search-row">
        <input
            type="search"
            class="input w-full"
            placeholder={`Search ${_.startCase(state.accountType)} by name or id`}
            bind:value={state.accountQuery}
            oninput={onAccountQueryInput}
        />
        {#if state.accountQuery}
            <button type="button" class="btn btn-ghost btn-sm" onclick={clearAccountQuery}>
                Clear
            </button>
        {/if}
    </div>

    {#if state.accountSearching}
        <p class="hint">Searching accounts...</p>
    {:else if state.accountError}
        <p class="hint error">{state.accountError}</p>
    {:else if state.designatedAccount}
        <div class="account-results">
            <div class="account-card selected">
                <div class="account-card-header">
                    <div>
                        <div class="account-name">{state.designatedAccount.name}</div>
                        <div class="account-type">{_.upperFirst(state.designatedAccount.type)}</div>
                    </div>
                </div>
                <div class="card-action">
                    <button
                        type="button"
                        class="btn btn-ghost btn-sm"
                        onclick={clearSelectedAccount}
                    >
                        Change
                    </button>
                </div>
            </div>
        </div>
    {:else if state.accountQuery.trim() && !state.accountResults.length}
        <p class="hint">
            No {_.toLower(state.accountType)} found for “{_.trim(state.accountQuery)}”.
        </p>
    {:else if state.accountResults.length}
        <div class="account-results">
            {#each state.accountResults as account (account.id)}
                <div class="account-card">
                    <div class="account-card-header">
                        <div>
                            <div class="account-name">{account.name}</div>
                            <div class="account-type">{_.upperFirst(account.type)}</div>
                        </div>
                    </div>
                    <div class="card-action">
                        <button
                            type="button"
                            class="btn btn-sm"
                            onclick={() => chooseAccount(account)}
                        >
                            Designate
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    {#if !state.designatedAccount}
        <p class="hint">
            Select a {_.startCase(state.accountType)} to designate it for the deployment.
        </p>
    {/if}
</fieldset>

<style lang="postcss">
    @reference 'tailwindcss';

    .fieldset {
        @apply mb-4;
    }

    .legend {
        @apply mb-3;
    }

    .type-toggle {
        @apply inline-flex gap-1 rounded-lg border border-gray-200 p-1;
    }

    .type-btn {
        @apply rounded-md px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50;
    }

    .type-btn.active {
        @apply bg-(--c1) text-white hover:bg-(--c1);
    }

    .search-row {
        @apply mt-3 flex gap-2;

        input {
            @apply rounded-lg;
        }
    }

    .hint {
        @apply mt-2 text-xs text-gray-500;
    }

    .hint.error {
        @apply text-red-600;
    }

    .account-results {
        @apply mt-3 flex flex-col gap-2;
    }

    .account-card {
        @apply flex flex-col gap-2 rounded-lg border border-gray-200 p-3;
    }

    .account-card.selected {
        @apply border-blue-500 bg-blue-50;
    }

    .account-card-header {
        @apply flex items-start gap-3;
    }

    .account-name {
        @apply font-semibold;
    }

    .account-type {
        @apply text-xs text-gray-400;
    }

    .card-action {
        @apply flex justify-end;
    }
</style>
