<script lang="ts">
    import _ from 'lodash'

    let { deploymentItem } = $props()

    let freezer = $derived(deploymentItem.freezer)

    let brandModel = $derived(`${freezer.brand} - ${freezer.model}`)

    let meta = $derived(`${freezer.capacity}${freezer.unit} • ${freezer.yearModel}`)
</script>

<div class="rounded bg-gray-50 p-4">
    <div class="flex flex-col gap-2">
        <div class="text-sm font-medium">{freezer.barcode}</div>
        <div class="text-xs text-gray-400">{brandModel}</div>
        <div class="text-xs text-gray-400">{meta}</div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
