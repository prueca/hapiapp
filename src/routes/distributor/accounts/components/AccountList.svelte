<script lang="ts">
    import AccountListItem from './AccountListItem.svelte'
    import Skeleton from '../../../components/Skeleton.svelte'

    let { accounts } = $props()
</script>

<div class="px-4">
    <div class="mb-2">Accounts</div>
    <div class="overflow-hidden rounded-lg bg-white">
        <!-- search -->
        <div class="border-b border-b-gray-100 p-4">search section</div>

        {#await accounts}
            <!-- loading skeletons  -->
            <Skeleton class="h-36 w-full rounded-none" />
        {:then accounts}
            <!-- list -->
            <div class="p-4">
                {#each accounts as item}
                    <AccountListItem {item} />
                {/each}
            </div>
        {/await}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
