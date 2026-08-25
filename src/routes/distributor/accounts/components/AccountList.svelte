<script lang="ts">
    import AccountListItem from './AccountListItem.svelte'
    let { accounts } = $props()
</script>

<div class="px-4">
    <div class="mb-2">Accounts</div>
    <div class="rounded-lg bg-white">
        <!-- search -->
        <div class="border-b border-b-gray-100 p-4">search section</div>
        <!-- list -->
        <div class="p-4">
            {#each accounts as item}
                <AccountListItem {item} />
            {/each}
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
