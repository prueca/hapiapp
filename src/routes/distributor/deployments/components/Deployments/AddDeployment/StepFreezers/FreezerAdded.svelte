<!--svelte-ignore  a11y_missing_attribute -->
<!--svelte-ignore  a11y_invalid_attribute -->
<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import deployment from '../deployment.svelte'

    let { freezer } = $props()
</script>

<div class="freezer-added">
    <div class="mb-4 flex flex-col gap-1">
        <div class="font-medium">{freezer.barcode}</div>
        <div class="text-gray-400">
            {_.upperFirst(freezer.brand)} - {_.startCase(freezer.model)}
        </div>
        <div class="text-gray-400">
            {freezer.capacity} • {freezer.unit} • {freezer.yearModel}
        </div>
    </div>
    <button
        type="button"
        class="remove-btn btn btn-xs"
        onclick={() => deployment.removeFreezer(freezer.id)}
    >
        <div class="icon">
            <Icon icon="boxicons:minus-square-filled" />
        </div>
        <span>Remove item</span>
    </button>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .freezer-added {
        @apply p-4 text-left text-sm;

        &:nth-child(odd) {
            @apply bg-gray-50;
        }
    }

    .remove-btn {
        @apply border-none bg-(--c1)/10 text-xs text-(--c1) no-underline;

        .icon {
            @apply inline-block text-sm;
        }
    }
</style>
