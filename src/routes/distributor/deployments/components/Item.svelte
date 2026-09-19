<script lang="ts">
     import _ from 'lodash'
     import Icon from '@iconify/svelte'
     import type { DeploymentGroup } from '$lib/types/deployment'
     import FreezerList from './FreezerList.svelte'
     import deployments from '../deployments.context.svelte'

     let { group }: { group: DeploymentGroup } = $props()

     let expanded = $state(false)

     let designation = $derived(group.designation)
     let date = $derived(
          group.deploymentDate && !Number.isNaN(group.deploymentDate.getTime())
               ? group.deploymentDate.toLocaleDateString()
               : '—')

     let overdue = $derived(deployments.isOverdue(group))
     let days = $derived(deployments.daysOverdue(group))
     let editing = $derived(deployments.isUpdating(group.key))
</script>

<div class="deployment-item">
     <div class="main">
          <div class="designation">
               <div class="name">{designation?.name ?? '—'}</div>
               {#if designation?.address}<div class="address">{designation.address}</div>{/if}
          </div>

          <div class="meta">
               <div class="date-line">
                    <span class="date">
                         <span class="label">Deployment Date:</span> {date}
                    </span>
                    {#if editing}
                         <span class="loading loading-xs loading-spinner"></span>
                    {:else}
                         <button
                          type="button"
                          class="edit"
                          aria-label="Change deployment date"
                          onclick={() => deployments.openEditDate(group)}
                        >
                          <Icon icon="bi:calendar2-day" width="14" />
                        </button>
                    {/if}
               </div>
               {#if overdue}
                    <span class="overdue-badge">Overdue · {days} {days === 1 ? 'day' : 'days'}</span>
                 {/if}
               <button
                type="button"
                class="qty"
                aria-label={expanded ? 'Hide freezers in this deployment' : 'View freezers in this deployment'}
                aria-expanded={expanded}
                onclick={() => (expanded = !expanded)}
              >
              <Icon icon="bi:boxes" width="16" />
              <span>{group.quantity}</span>
              <Icon icon={expanded ? 'bi:chevron-up' : 'bi:chevron-down'} width="14" />
              </button>
          </div>
      </div>

     {#if expanded}
         <div class="collapsible">
             <FreezerList {group} />
         </div>
     {/if}
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .deployment-item {
         @apply not-last:mb-4 not-last:border-b not-last:border-b-gray-100 not-last:pb-4;
     }

    .main {
         @apply flex items-start justify-between gap-4;
     }

    .designation {
         @apply min-w-0;
     }

    .name {
         @apply truncate font-semibold;
     }

    .address {
         @apply text-xs text-gray-500;
     }

     .meta {
          @apply flex flex-none flex-col items-end gap-2 text-xs text-gray-500;
     }

     .date {
          @apply flex items-center gap-1;
     }

     .label {
          @apply font-medium;
     }

     .date-line {
          @apply flex items-center justify-end gap-1.5;
     }

     .edit {
          @apply inline-flex cursor-pointer items-center justify-center rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600;
     }

     .overdue-badge {
          @apply inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600;
     }

    .qty {
         @apply inline-flex cursor-pointer items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 hover:bg-blue-100;
     }

    .collapsible {
         @apply mt-3;
     }
</style>
