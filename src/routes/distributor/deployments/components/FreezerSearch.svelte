<script lang="ts">
    import Icon from '@iconify/svelte'

    let barcode = $state('')
    let clear = () => {
        barcode = ''
    }
</script>

<fieldset class="fieldset">
    <div class="mb-2">
        <legend class="fieldset-legend">Search Freezer</legend>
        <p class="label">Select one or more freezers to deploy</p>
    </div>
    <div class="join">
        <!-- input -->
        <label class="input grow pl-0">
            <input type="text" placeholder="Enter barcode" bind:value={barcode} />
            <button class="cursor-pointer" class:hidden={!barcode} onclick={() => clear()}>
                <Icon class="text-gray-400" icon="flowbite:close-circle-solid" width="18" />
            </button>
        </label>
        <!-- search button -->
        <button class="btn join-item">Search</button>
    </div>
</fieldset>

<style lang="postcss">
    @reference 'tailwindcss';

    .fieldset {
        @apply mb-4;
    }

    .fieldset-legend {
        @apply pt-0 text-lg font-normal text-(--font-color);
    }

    .input {
        @apply rounded-l-lg;
    }

    .btn {
        @apply rounded-r-lg;
    }
</style>
