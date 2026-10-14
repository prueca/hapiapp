<!--svelte-ignore  a11y_missing_attribute -->
<!--svelte-ignore  a11y_invalid_attribute -->
<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import Skeleton from '../../../../../../components/Skeleton.svelte'
    import step1 from '../../../../step1.svelte'
    import deployment from '../../../../deployment.svelte'

    let freezer = $derived(step1.freezer)

    let added = $derived.by(() => {
        return freezer ? deployment.freezers.includes(freezer.id) : false
    })
</script>

{#if step1.loading}
    <Skeleton class="mt-2 h-34 w-full" />
{:else if freezer}
    <div class="freezer-search-result">
        <div class="mb-4 flex flex-col gap-1">
            <div class="font-medium">{freezer.barcode}</div>
            <div class="text-gray-400">
                {_.upperFirst(freezer.brand)} - {_.startCase(freezer.model)}
            </div>
            <div class="text-gray-400">
                {freezer.capacity} • {freezer.unit} • {freezer.yearModel}
            </div>
        </div>

        {#if added}
            <div class="added badge badge-sm">Added to selection</div>
        {:else}
            <button
                type="button"
                class="add-btn btn btn-xs"
                onclick={() => deployment.addFreezer(freezer.id)}
            >
                <div class="icon">
                    <Icon icon="boxicons:check-square-filled" />
                </div>
                <span>Add to selection</span>
            </button>
        {/if}
    </div>
{/if}

<style lang="postcss">
    @reference 'tailwindcss';

    .freezer-search-result {
        @apply mt-4 rounded bg-gray-50 p-4 text-left text-sm;
    }

    .added {
        @apply rounded-sm border-none bg-(--c4) text-white;
    }

    .add-btn {
        @apply rounded border-none bg-(--c4)/10 text-xs text-(--c4) no-underline;

        .icon {
            @apply inline-block;
        }
    }
</style>
