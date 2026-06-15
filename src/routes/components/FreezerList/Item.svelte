<script lang="ts">
    import Icon from '@iconify/svelte'

    const props = $props()
</script>

<div class="freezer">
    <div class="flex items-center justify-between">
        <div>{props.id}</div>
        <button class="ellipsis-btn btn p-0 btn-link btn-sm">
            <Icon icon="octicon:ellipsis-16" width="20" />
        </button>
    </div>
    <div class="freezer-name">{props.name}</div>
    <div class="data">
        <div class="lbl">Cabcon</div>
        <div class="val">{props.cabcon}</div>
    </div>
    <div class="data">
        <div class="lbl">Assigned On</div>
        <div class="val">{props.dateAssigned}</div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .freezer {
        @apply mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2;
    }
    .freezer-name {
        @apply mb-4;
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
