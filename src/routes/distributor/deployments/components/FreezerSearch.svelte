<script lang="ts">
    import Icon from '@iconify/svelte'

    let barcode = $state('')
    let clear = () => {
        barcode = ''
    }
</script>

<fieldset class="mb-4 fieldset">
    <legend class="mb-1 text-gray-400">Freezer barcode</legend>
    <div class="mb-1 flex gap-2">
        <!-- barcode input -->
        <label class="input grow rounded-lg">
            <!-- <Icon class="text-gray-400" icon="glyphs:barcode-read-bold" width="18" /> -->
            <input type="text" placeholder="Enter barcode" bind:value={barcode} />
            <button class="cursor-pointer" class:hidden={!barcode} onclick={() => clear()}>
                <Icon class="text-gray-400" icon="flowbite:close-circle-solid" width="18" />
            </button>
        </label>

        <!-- search button -->
        <button class="btn rounded-lg">
            <Icon class="md:hidden" icon="icon-park-outline:search" width="18" />
            <span class="hidden md:block">Search</span>
        </button>
    </div>
    <p class="label">Search and add at least one freezer to continue.</p>
</fieldset>
