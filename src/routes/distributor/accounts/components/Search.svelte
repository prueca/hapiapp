<script lang="ts">
    import Icon from '@iconify/svelte'
    import accounts from '../accounts.context.svelte'

    const onkeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            accounts.load()
        }
    }
</script>

<div class="border-b border-b-gray-100 p-4">
    <div class="flex gap-2">
        <!-- Search -->
        <div class="grow">
            <label class="input w-full rounded-l-md">
                <Icon icon="bytesize:search" width="20" />
                <input type="search" class="grow" placeholder="Search account..." {onkeydown} />
            </label>
        </div>

        <button type="button" class="btn rounded-md" onclick={() => accounts.toggleSearchOptions()}>
            <Icon icon="bi:filter" width="24" />
        </button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
