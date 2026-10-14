<script lang="ts">
    import Icon from '@iconify/svelte'
    import step1 from '../../../../step1.svelte'
</script>

<div>
    <p class="label">Search freezer</p>
    <div class="join w-full">
        <!-- input -->
        <label class="input grow pl-0">
            <input type="text" placeholder="Enter barcode" bind:value={step1.barcode} />
            <button
                class="cursor-pointer"
                class:hidden={!step1.barcode}
                onclick={() => step1.clear()}
            >
                <Icon class="text-gray-400" icon="flowbite:close-circle-solid" width="18" />
            </button>
        </label>
        <!-- search button -->
        <button class="btn join-item" onclick={() => step1.searchFreezer()}>Search</button>
    </div>
    <p class="label mt-2 text-xs" class:hidden={!step1.message}>{step1.message}</p>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .label {
        @apply mb-2 text-sm;
    }

    .input {
        @apply rounded-l;
    }

    .btn {
        @apply rounded-r;
    }
</style>
