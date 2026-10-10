<!--svelte-ignore  a11y_missing_attribute -->
<!--svelte-ignore  a11y_invalid_attribute -->
<script lang="ts">
    import Icon from '@iconify/svelte'

    let { added = false } = $props()
</script>

<div class="search-result">
    <div class="mb-4 flex flex-col gap-1">
        <div class="font-medium">929991192693409444629843</div>
        <div class="text-gray-400">Aucma - Curved Sliding Glass Lighted</div>
        <div class="text-gray-400">12 • cu • 2022</div>
    </div>

    {#if added}
        <div class="added badge">Added to selection</div>
    {:else}
        <button type="button" class="add-btn btn btn-sm">
            <div class="icon">
                <Icon icon="akar-icons:check-box-fill" />
            </div>
            <span>Add to selection</span>
        </button>
    {/if}
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .search-result {
        @apply rounded-lg bg-gray-50 p-4 text-left text-sm;

        .added {
            @apply mt-2 rounded-sm border-none bg-(--c6) text-white;
        }

        .add-btn {
            @apply rounded-lg bg-(--c6) text-sm text-white no-underline;

            .icon {
                @apply mr-1 inline-block;
            }
        }
    }
</style>
