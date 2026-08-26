<script lang="ts">
    import AccountListItem from './AccountListItem.svelte'
    import Skeleton from '../../../components/Skeleton.svelte'
    import Search from './Search.svelte'

    let { accounts } = $props()
</script>

<div class="px-4">
    <div class="mb-2 flex items-center justify-between">
        <span class="text-lg">Accounts</span>
        <div class="flex items-center">
            <button type="button" class="delete-account btn btn-ghost btn-xs">
                <span>&minus;</span>
                <span>Delete</span>
            </button>
            <div class="divider-sm divider mx-0 mt-0.5 divider-horizontal h-5"></div>
            <button type="button" class="create-account btn btn-ghost btn-xs">
                <span>&plus;</span>
                <span>Create</span>
            </button>
        </div>
    </div>
    <div class="overflow-hidden rounded-lg bg-white">
        <!-- search -->
        <Search />

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

    .create-account,
    .delete-account {
        @apply flex items-center gap-2 rounded-md text-sm;
    }
</style>
