<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="bg-(--c7) p-4">
    <div class="label">Search deployment</div>
    <div class="flex gap-2">
        <input type="search" class="input grow" placeholder="Search by ID or account name..." />
        <button type="button" class="btn">
            <Icon icon="icon-park-outline:search" width="18" />
        </button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .label {
        @apply mb-2 text-sm text-gray-400;
    }

    .input {
        @apply grow;
    }
</style>
