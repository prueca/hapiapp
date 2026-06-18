<script lang="ts">
    import Icon from '@iconify/svelte'

    const props = $props()
</script>

<div class="freezer">
    <div class="section">
        <div class="flex items-center justify-between">
            <div>{props.id}</div>
            <button class="ellipsis-btn btn p-0 btn-link btn-sm">
                <Icon icon="octicon:ellipsis-16" width="20" />
            </button>
        </div>
        <div>{props.name}</div>
    </div>
    <div class="section">
        <div class="data">
            <div class="lbl">Cabcon</div>
            <div class="val">{props.cabcon}</div>
        </div>
        <div class="data">
            <div class="lbl">Assigned On</div>
            <div class="val">{props.dateAssigned}</div>
        </div>
    </div>
    <div class="section actions">
        <button class="btn btn-sm">Submit</button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .freezer {
        @apply mb-4 overflow-hidden rounded-lg border border-gray-200;
    }
    .section {
        @apply px-4 py-2;

        &.actions {
            @apply mt-2 mb-0 flex items-center justify-between gap-2 bg-gray-50 px-4 py-3;

            .btn {
                @apply rounded-lg border-none bg-(--c2) text-white;
            }
        }
    }
    .data {
        @apply mb-1 flex items-center justify-between gap-1;
    }
    .lbl {
        @apply text-gray-400;
    }
    .ellipsis-btn {
        @apply text-gray-400;
    }
</style>
