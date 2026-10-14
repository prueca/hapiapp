<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="bg-(--c7) p-4">
    <div class="mb-2 text-xs text-(--font-color)/65">Search deployment</div>
    <div class="flex gap-2">
        <div class="grow">
            <label class="input w-full">
                <Icon icon="bytesize:search" width="20" />
                <input type="search" class="grow" placeholder="Search by ID or account name..." />
            </label>
        </div>
        <button type="button" class="btn">
            <Icon icon="bi:filter" width="24" />
        </button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
