<!--
  Freezer card (one row in the list).

  Props: { freezer }. Renders three sections:
   1. Status badge (colored via statusColors, sourced from
      $lib/config/cabcon.status) plus the code-month badge.
   2. Freezer data: `brand - model` and a meta line (capacity • yearModel •
      barcode), shown only when at least one is present.
   3. Account data (type / name / address), shown only when present.
  The `.freezer-item` card style is mirrored by Item.skeleton.svelte so the
  loading placeholder matches the real card.
-->
<script lang="ts">
    import _ from 'lodash'
    import cabconStatuses from '$lib/config/cabcon.status'
    import type { Freezer } from '$lib/types/freezer'

    let { freezer }: { freezer: Freezer } = $props()

    let meta = $derived(
         [freezer.capacity, freezer.yearModel, freezer.barcode]
             .filter((v) => v !== null && v !== undefined && v !== '')
             .map(String)
    )

    const statusColors: Record<string, string> = {
         [cabconStatuses.MATCHED]: 'bg-green-100 text-green-700',
         [cabconStatuses.MISMATCH]: 'bg-red-100 text-red-700',
         [cabconStatuses.MANUAL_SUBMIT]: 'bg-amber-100 text-amber-700'
    }

    let statusLabel = $derived(freezer.cabconStatus ? _.startCase(freezer.cabconStatus) : '—')

    let statusClass = $derived(
         (freezer.cabconStatus && statusColors[freezer.cabconStatus]) || 'bg-gray-100 text-gray-400'
    )

    let typeLabel = $derived(freezer.accountType ? _.upperFirst(freezer.accountType) : null)

    let accountName = $derived(freezer.accountName ?? null)

    let accountAddress = $derived(freezer.accountAddress ?? null)

    let codeMonthLabel = $derived(freezer.codeMonth ?? '—')
</script>

<div class="freezer-item">
    <div class="top-row">
         <div class="badges">
             <span class="badge {statusClass}">{statusLabel}</span>
             <span class="code-month badge">{codeMonthLabel}</span>
         </div>
    </div>

    <div class="body">
         <div class="model">{freezer.brand} - {freezer.model}</div>
         {#if meta.length}
             <div class="meta">{meta.join(' • ')}</div>
         {/if}
    </div>

    {#if typeLabel || accountName || accountAddress}
         <div class="account-section">
             {#if typeLabel}
                 <div class="account-type">{typeLabel}</div>
             {/if}
             {#if accountName}
                 <div class="account-name">{accountName}</div>
             {/if}
             {#if accountAddress}
                 <div class="account-address">{accountAddress}</div>
             {/if}
         </div>
    {/if}
</div>

<style lang="postcss">
    @reference 'tailwindcss';

      .freezer-item {
          @apply rounded-lg border border-gray-100 bg-white p-4 shadow-sm;
      }

      .top-row {
        @apply flex justify-end;
    }

    .body {
        @apply mt-2 border-b border-b-gray-100 pb-3;
    }

    .model {
        @apply font-semibold;
    }

    .meta {
        @apply text-xs text-gray-400;
    }

    .badges {
        @apply flex items-center gap-2;
    }

    .badge {
        @apply rounded-full px-2 py-0.5 text-xs font-medium;
    }

    .badge.code-month {
        @apply bg-blue-50 font-mono text-blue-700;
    }

    .account-section {
        @apply flex flex-col gap-0.5 pt-3;
    }

    .account-type {
        @apply text-sm font-medium text-gray-700;
    }

    .account-name {
        @apply text-sm text-gray-600;
    }

    .account-address {
        @apply text-xs text-gray-400;
    }
</style>
