<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import type { DeploymentRow } from '$lib/types/deployment'
    import FreezerList from './FreezerList.svelte'
    import deployments from '../deployments.context.svelte'

    let { deployment }: { deployment: DeploymentRow } = $props()

    let expanded = $state(false)

    let designation = $derived(deployment.designation)
    let date = $derived(
        deployment.deploymentDate && !Number.isNaN(deployment.deploymentDate.getTime())
             ? deployments.formatDate(deployment.deploymentDate)
             : '—'
     )

    let overdue = $derived(deployments.isOverdue(deployment))
    let days = $derived(deployments.daysOverdue(deployment))
    let editing = $derived(deployments.isUpdating(deployment.id))
    let quantity = $derived(deployment.deploymentItemCount)
    let statusLabel = $derived(_.startCase(deployment.status))
</script>

<div class="deployment-item">
    <div class="main">
        <div class="designation">
            <div class="name">{designation?.name ?? '—'}</div>
            {#if designation?.address}<div class="address">{designation.address}</div>{/if}
        </div>

        <div class="meta">
            <span class="status-badge">{statusLabel}</span>
            <div class="date-line">
                <span class="date">
                    <span class="label">Deployment Date:</span>
                    {date}
                </span>
                {#if editing}
                    <span class="loading loading-xs loading-spinner"></span>
                {:else}
                    <button
                        type="button"
                        class="edit"
                         aria-label="Change deployment date"
                         onclick={() => deployments.openEditDate(deployment)}
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
                aria-label={expanded
                    ? 'Hide freezers in this deployment'
                    : 'View freezers in this deployment'}
                aria-expanded={expanded}
                onclick={() => (expanded = !expanded)}
            >
                  <Icon icon="bi:boxes" width="16" />
                  <span>{quantity}</span>
                <Icon icon={expanded ? 'bi:chevron-up' : 'bi:chevron-down'} width="14" />
            </button>
        </div>
    </div>

      {#if expanded}
          <div class="collapsible">
              <FreezerList {deployment} />
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

    .status-badge {
        @apply inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600;
    }

    .qty {
        @apply inline-flex cursor-pointer items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 hover:bg-blue-100;
    }

    .collapsible {
        @apply mt-3;
    }
</style>
