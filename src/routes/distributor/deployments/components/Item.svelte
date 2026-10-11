<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import type { DeploymentRow } from '$lib/types/deployment'
    import state from '../deployment.listing.svelte'

    let { row }: { row: DeploymentRow } = $props()

    const name = $derived(row.destinationName ?? '—')
    const address = $derived(row.destinationAddress ?? '—')
    const destinationLabel = $derived(row.destinationType ? _.upperFirst(row.destinationType) : '')
    const originLabel = $derived(_.startCase(row.originStatus))
    const destinationStatusLabel = $derived(_.startCase(row.destinationStatus))
    const dateLabel = $derived(row.deploymentDate ? state.formatDate(row.deploymentDate) : '—')
    const overdue = $derived(state.isOverdue(row))
</script>

<div class="deployment-item">
    <div class="main">
        <div class="dest">
            <div class="dest-head">
                <div class="dest-name">{name}</div>
                {#if destinationLabel}
                    <span class="type-badge">{destinationLabel}</span>
                {/if}
                {#if overdue}
                    <span class="overdue">Overdue</span>
                {/if}
            </div>

            {#if address !== '—'}
                <div class="dest-address">{address}</div>
            {/if}
        </div>

        <div class="meta">
            <div class="badges">
                <span class="origin badge" title="Origin status">{originLabel}</span>
                <span class="destination badge" title="Destination status">
                    {destinationStatusLabel}
                </span>
            </div>

            <div class="date">
                <Icon icon="bi:calendar2-day" width="14" />
                <span>{dateLabel}</span>
            </div>

            <div class="count" title="Freezer units in this deployment">
                <Icon icon="carbon:list-boxes" width="16" />
                <span>{row.deploymentItemCount}</span>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .deployment-item {
        @apply not-last:border-b not-last:border-b-gray-100;
    }

    .main {
        @apply flex items-start justify-between gap-4 p-4;
    }

    .dest-head {
        @apply flex flex-wrap items-center gap-2;
    }

    .dest-name {
        @apply font-semibold;
    }

    .type-badge {
        @apply inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600;
    }

    .overdue {
        @apply inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600;
    }

    .dest-address {
        @apply mt-0.5 text-xs text-gray-400;
    }

    .meta {
        @apply flex flex-none flex-col items-end gap-2 text-xs text-gray-500;
    }

    .badges {
        @apply flex flex-wrap items-center justify-end gap-1.5;
    }

    .badge {
        @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold;
    }

    .badge.origin {
        @apply bg-blue-50 text-blue-600;
    }

    .badge.destination {
        @apply bg-gray-100 text-gray-600;
    }

    .date {
        @apply flex items-center gap-1.5;
    }

    .count {
        @apply flex items-center gap-1.5 font-medium;
    }
</style>
