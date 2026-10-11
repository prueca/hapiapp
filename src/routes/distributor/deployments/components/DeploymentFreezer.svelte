<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'

    let data = {
        barcode: '982675644385781919917342',
        brand: 'Aucma',
        model: 'Swing Up Freezer',
        capacity: '18',
        unit: 'cu',
        yearModel: 2021
    }

    let brandModel = $derived(`${data.brand} - ${data.model}`)
    let meta = $derived(`${data.capacity}${data.unit} • ${data.yearModel}`)
</script>

<div class="rounded-lg bg-gray-50 p-4">
    <div class="flex flex-col gap-2">
        <div class="text-sm font-medium">{data.barcode}</div>
        <div class="text-xs text-gray-400">{brandModel}</div>
        <div class="text-xs text-gray-400">{meta}</div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
