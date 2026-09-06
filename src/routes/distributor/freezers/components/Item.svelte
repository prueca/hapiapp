<script lang="ts">
    import _ from 'lodash'
    import type { Freezer } from '$lib/types/freezer'

    let { freezer }: { freezer: Freezer } = $props()

    let meta = $derived(
        [freezer.capacity, freezer.unit, freezer.yearModel]
            .filter((v) => v !== null && v !== undefined && v !== '')
            .map(String)
    )

    let statusLabel = $derived(freezer.status ? _.startCase(freezer.status) : '—')

    let model = $derived(`${_.startCase(freezer.brand)} - ${_.startCase(freezer.model)}`)
</script>

<div class="freezer-item">
    <div class="top-row">
        <span class="badge">{statusLabel}</span>
    </div>

    <div class="barcode">{freezer.barcode}</div>

    <div class="model">{model}</div>

    {#if meta.length}
        <div class="meta">{meta.join(' • ')}</div>
    {/if}
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .freezer-item {
        @apply not-last:mb-4 not-last:border-b not-last:border-b-gray-100 not-last:pb-4;
    }

    .top-row {
        @apply flex justify-end;
    }

    .badge {
        @apply inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600;
    }

    .barcode {
        @apply mt-1 font-semibold;
    }

    .model {
        @apply mt-1 font-semibold text-gray-400;
    }

    .meta {
        @apply mt-0.5 text-xs text-gray-400;
    }
</style>
