<script lang="ts">
    import state from '../deployments.context.svelte'
    import StepFreezers from './steps/StepFreezers.svelte'
    import StepAccount from './steps/StepAccount.svelte'
    import StepDate from './steps/StepDate.svelte'
</script>

<div class="deploy-freezers">
      {#if state.submitError}
         <p class="error">{state.submitError}</p>
     {/if}

       <div class="stepper">
           {#each state.stepLabels as label, i}
                <button
                    type="button"
                    class="step"
                    class:active={state.deployStep === i + 1}
                    class:reachable={state.canReachStep(i + 1)}
                    disabled={!state.canReachStep(i + 1)}
                    onclick={() => state.goToStep(i + 1)}
                >
                    <span class="step-number">{i + 1}</span>
                    <span class="step-label">{label}</span>
                </button>
           {/each}
       </div>

     <div class="step-body">
         {#if state.deployStep === 1}
             <StepFreezers />
         {:else if state.deployStep === 2}
             <StepAccount />
         {:else}
             <StepDate />
         {/if}
     </div>

     <div class="actions">
          <button
             type="button"
             class="btn btn-ghost"
             disabled={state.deployStep === 1}
             onclick={() => state.prevStep()}
           >
             Back
           </button>

          <button
             type="button"
             class="btn btn-ghost"
             onclick={() => state.cancelWizard()}
           >
             Cancel
           </button>

          <div class="grow"></div>

           {#if state.deployStep < 3}
               <button
                 type="button"
                 class="btn"
                 disabled={!state.canReachStep(state.deployStep + 1)}
                 onclick={() => state.nextStep()}
               >
                 Next
               </button>
           {:else}
               <button
                 type="button"
                 class="btn"
                 disabled={state.submitting ||
                    state.selectedFreezers.length === 0 ||
                     !state.designatedAccount}
                 onclick={() => state.submitBatch()}
             >
              {#if state.submitting}
                    {state.isCreate ? 'Deploying...' : 'Saving...'}
                 {:else}
                     {state.isCreate
                       ? `Deploy ${state.selectedFreezers.length} FREEZERS`
                       : 'Update deployment'}
                 {/if}
               </button>
           {/if}
     </div>
</div>

<style lang="postcss">
     @reference 'tailwindcss';

      .stepper {
           @apply mb-4 flex items-center gap-2;
       }

       .step {
           @apply flex cursor-pointer flex-1 items-center gap-2 rounded-lg border border-gray-200 p-2 text-left text-sm disabled:cursor-not-allowed;
        }

       .step.active {
           @apply border-blue-500 bg-blue-50;
        }

       .step.reachable:not(.active) {
           @apply hover:bg-gray-50;
        }

       .step:not(.reachable) {
           @apply opacity-50;
        }

       .step-number {
           @apply flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-100 text-xs font-medium;
        }

       .step.active .step-number {
           @apply bg-blue-500 text-white;
        }

       .step-label {
           @apply font-medium;
        }

       .step-body {
           @apply rounded-lg border border-gray-100 p-4;
       }

       .actions {
           @apply mt-4 flex justify-between;
       }

       .error {
           @apply mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600;
       }
 </style>
