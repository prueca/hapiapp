<script lang="ts">
    import AccountListItem from './AccountListItem.svelte'
    let { data } = $props()
    let accounts = $derived(data.accounts)
</script>

<div class="px-4">
    <div class="mb-2 text-xl">Accounts</div>
    <div class="list">
        {#each accounts as item}
            <AccountListItem {item} />
        {/each}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .list {
        @apply rounded-lg bg-white p-4;
    }
</style>
