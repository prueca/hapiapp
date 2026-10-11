<script lang="ts">
    import Icon from '@iconify/svelte'

    let query = $state('')
    let clear = () => {
        query = ''
    }
</script>

<fieldset class="fieldset">
    <div class="mb-2">
        <legend class="fieldset-legend">Search Account</legend>
        <p class="label">Select destination account to deploy to</p>
    </div>
    <div class="join">
        <!-- input -->
        <label class="input grow pl-0">
            <input type="text" placeholder="Enter account ID or name" bind:value={query} />
            <button class="cursor-pointer" class:hidden={!query} onclick={() => clear()}>
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
        @apply rounded-l;
    }

    .btn {
        @apply rounded-r;
    }
</style>
