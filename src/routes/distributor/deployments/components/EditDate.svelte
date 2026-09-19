<script lang="ts">
     import state from '../deployments.context.svelte'
</script>

{#if state.editingGroup}
     <div
          class="modal-open modal"
          role="dialog"
          aria-modal="true"
          aria-label="Update deployment date"
          tabindex={-1}
          onkeydown={(e) => e.key === 'Escape' && state.closeEditDate()}
          onclick={(e) => e.target === e.currentTarget && state.closeEditDate()}
     >
          <div class="modal-box">
               <div class="heading">
                    <p class="mb-4 text-lg font-bold">Update Deployment Date</p>
               </div>

               {#if state.updateError}
                    <p class="error mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">
                         {state.updateError}
                    </p>
              {:else}
                   <fieldset class="fieldset">
                        <label class="label">Deployment date</label>
                        <input
                          type="date"
                          class="input w-full"
                          bind:value={state.editDate}
                        />
                   </fieldset>
              {/if}

               <div class="modal-action">
                    <button class="close-btn btn" onclick={() => state.closeEditDate()}>
                         Cancel
                    </button>
                    <button
                        class="btn"
                        disabled={state.isUpdating(state.editingGroup.key)}
                        onclick={() => state.submitEditDate()}
                    >
                         {#if state.isUpdating(state.editingGroup.key)}
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

          input {
               @apply rounded-lg;
          }
     }

     .close-btn {
          @apply cursor-pointer rounded-lg border-none;
     }
</style>
