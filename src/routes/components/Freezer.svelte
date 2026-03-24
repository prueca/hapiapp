<script lang="ts">
    import Icon from '@iconify/svelte'

    const props = $props()
</script>

<div class="freezer">
    <div class="flex items-center justify-between">
        <div class="freezer-id">{props.id}</div>
        <button class="btn btn-ghost btn-sm">
            <Icon icon="octicon:ellipsis-16" width="20" />
        </button>
    </div>
    <div class="freezer-name">
        {props.name}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .freezer {
        @apply mb-4 rounded border border-slate-200 bg-slate-50 p-4 md:mb-0;
    }

    .freezer-name {
        @apply mt-2;
    }
</style>
