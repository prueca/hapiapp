<script lang="ts">
    import state from '../../deployments.context.svelte'
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

{#if state.selectedFreezers.length || state.designatedAccount}
      <fieldset class="fieldset">
          <legend class="label">Summary</legend>
         <div class="summary">
             <div class="summary-row">
                 <span class="summary-label">Freezers</span>
                 <span>{state.selectedFreezers.length}</span>
             </div>
             <div class="summary-row">
                 <span class="summary-label">Designated to</span>
                 <span>{state.designatedAccount?.name ?? '—'}</span>
             </div>
             <div class="summary-row">
                 <span class="summary-label">Date</span>
                 <span>{state.deploymentDate}</span>
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
