<script lang="ts">
    import Icon from '@iconify/svelte'
    import users from '../users.context.svelte'
</script>

<div class="border-b border-b-gray-100 p-4">
    <div class="flex gap-2">
        <!-- Search -->
        <div class="grow">
            <label class="input w-full rounded-lg">
                <Icon icon="bytesize:search" width="20" />
                <input
                    type="search"
                    class="grow"
                    placeholder="Search user..."
                    bind:value={users.query}
                    onkeyup={() => users.filter()}
                />
            </label>
        </div>

        <button
            type="button"
            class="btn rounded-lg"
            onclick={() => users.toggleSearchOptions(true)}
        >
            <Icon icon="bi:filter" width="24" />
        </button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
