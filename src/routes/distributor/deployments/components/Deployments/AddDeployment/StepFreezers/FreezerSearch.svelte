<script lang="ts">
    import Icon from '@iconify/svelte'
    import step1 from '../../../../step1.svelte'
</script>

<div>
    <p class="label">Search freezer</p>
    <div class="flex items-center justify-between gap-2">
        <!-- input -->
        <input class="input" type="search" placeholder="Enter barcode" bind:value={step1.barcode} />
        <!-- search button -->
        <button class="btn" onclick={() => step1.searchFreezer()}>
            <Icon icon="icon-park-outline:search" width="18" />
        </button>
    </div>
    <p class="label mt-2 text-xs" class:hidden={!step1.message}>{step1.message}</p>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .label {
        @apply mb-2 text-sm;
    }

    .input {
        @apply grow rounded;
    }

    .btn {
        @apply rounded-r;
    }
</style>
