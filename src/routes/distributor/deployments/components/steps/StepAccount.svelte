<script lang="ts">
     import _ from 'lodash'
     import state from '../../deployments.context.svelte'

     const chooseAccount = (account: (typeof state.accountResults)[number]) =>
           state.selectAccount(account)

     const clearSelectedAccount = () => {
          state.clearDesignation()
        }

     const onAccountQueryInput = _.debounce(() => state.searchAccounts(), 250)
</script>

<fieldset class="fieldset">
        <legend class="label">Account name or id</legend>
      <div class="flex gap-2">
          <input
             type="text"
             class="input w-full"
             placeholder="Search account by name or id"
             bind:value={state.accountQuery}
             oninput={onAccountQueryInput}
          />
          {#if state.accountQuery}
              <button
               type="button"
               class="btn btn-ghost btn-sm"
               onclick={() => {
                  state.accountQuery = ''
                  state.searchAccounts()
                }}
              >
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
             No account found for “{_.trim(state.accountQuery)}”.
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
</fieldset>

{#if !state.designatedAccount}
     <p class="hint">Select a designation account to continue.</p>
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
