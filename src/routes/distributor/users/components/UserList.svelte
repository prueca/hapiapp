<script lang="ts">
    import { onMount } from 'svelte'
    import users from '../users.context.svelte'
    import Skeleton from '../../../components/Skeleton.svelte'
    import UserListItem from './UserListItem.svelte'
    import create from '../create.context.svelte'

    onMount(() => users.load())
</script>

<div class="px-4 text-justify">
    <div class="mb-2 flex items-center justify-between">
        <span class="text-lg">Users</span>
        <div class="flex items-center">
            <button
                type="button"
                class="create-user btn btn-ghost btn-xs"
                onclick={() => create.toggle(true)}
            >
                <span>&plus;</span>
                <span>Create</span>
            </button>
        </div>
    </div>
    <div class="overflow-hidden rounded-lg bg-white">
        <!-- search components -->
        <!-- <Search /> -->
        <!-- <SearchOptions /> -->

        {#if users.loading}
            <Skeleton class="h-36 w-full rounded-none" />
        {:else if users.error}
            <p class="p-4">Error: {users.error}</p>
        {:else}
            <p class="p-4">
                {#each users.filtered as item}
                    <UserListItem {item} />
                {/each}
            </p>
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .create-user {
        @apply flex items-center gap-2 rounded-md text-sm;
    }
</style>
