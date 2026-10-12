<script lang="ts">
    import Icon from '@iconify/svelte'
    import step1 from '../step1.svelte'
</script>

<fieldset class="fieldset">
    <div class="mb-2">
        <legend class="fieldset-legend">Search Freezer</legend>
        <p class="label">Select one or more freezers to deploy</p>
    </div>
    <div class="join">
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
</fieldset>

<style lang="postcss">
    @reference 'tailwindcss';

    .fieldset-legend {
        @apply pt-0 text-lg font-normal text-(--font-color);
    }

    .input {
        @apply rounded-l;
    }

    .btn {
        @apply rounded-r;
    }
</style>
