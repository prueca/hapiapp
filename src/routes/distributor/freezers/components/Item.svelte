<script lang="ts">
    import _ from 'lodash'
    import type { Freezer } from '$lib/types/freezer'

    let { freezer }: { freezer: Freezer } = $props()

    let meta = $derived(
        [freezer.capacity, freezer.unit, freezer.yearModel]
            .filter((v) => v !== null && v !== undefined && v !== '')
            .map(String)
    )

    let model = $derived(`${_.startCase(freezer.brand)} - ${_.startCase(freezer.model)}`)
</script>

<div class="freezer-item">
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
