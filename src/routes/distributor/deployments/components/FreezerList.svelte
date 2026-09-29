<script lang="ts">
    import _ from 'lodash'
    import type { DeploymentRow, DeploymentItemWithFreezer } from '$lib/types/deployment'

    let { deployment }: { deployment: DeploymentRow } = $props()

    const modelOf = (freezer: DeploymentItemWithFreezer['freezer']) =>
        freezer ? `${_.startCase(freezer.brand)} - ${_.startCase(freezer.model)}` : '—'
</script>

<div class="list">
     {#each deployment.deploymentItems as item (item.id)}
         {@const freezer = item.freezer}
         <div class="freezer-item">
             <div class="freezer-actions">
                 <span class="status">{_.startCase(item.status)}</span>
             </div>

             <div class="bar-code">{freezer?.barcode}</div>
             <div class="model">{modelOf(freezer)}</div>
             <div class="freezer-meta">
                 {freezer?.capacity}{freezer?.unit} · {freezer?.yearModel}
             </div>
         </div>
     {/each}
 </div>

<style lang="postcss">
    @reference 'tailwindcss';

    .list {
        @apply flex flex-col gap-2;
    }

    .freezer-item {
        @apply relative flex flex-col gap-1 rounded-lg border border-gray-100 p-3 pt-9;
    }

    .freezer-actions {
        @apply absolute top-2 right-2 flex items-center gap-1.5;
    }

      .status {
           @apply inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600;
       }

       .bar-code {
        @apply font-semibold;
    }

    .model {
        @apply font-semibold text-gray-400;
    }

    .freezer-meta {
        @apply mt-0.5 text-xs text-gray-400;
    }
</style>
