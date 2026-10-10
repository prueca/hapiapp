<!--svelte-ignore  a11y_missing_attribute -->
<!--svelte-ignore  a11y_invalid_attribute -->
<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="freezer-added">
    <div class="mb-4 flex flex-col gap-1">
        <div class="font-medium">929991192693409444629843</div>
        <div class="text-gray-400">Aucma - Curved Sliding Glass Lighted</div>
        <div class="text-gray-400">12 • cu • 2022</div>
    </div>
    <button type="button" class="remove-btn btn btn-sm">
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

        .remove-btn {
            @apply rounded-lg border-none bg-(--c1)/10 text-sm text-(--c1) no-underline;

            .icon {
                @apply -mt-0.5 mr-1 inline-block text-sm;
            }
        }
    }
</style>
