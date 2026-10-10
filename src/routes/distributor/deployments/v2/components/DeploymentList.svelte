<script lang="ts">
    import { onMount } from 'svelte'
    import DeploymentListItem from './DeploymentListItem.svelte'
    import SearchDeployment from './SearchDeployment.svelte'
    import Skeleton from '../../../../components/Skeleton.svelte'
    import state from '../../deployments.context.svelte'

    onMount(() => state.load())
</script>

<div>
    <SearchDeployment />
    <div class="flex flex-col gap-2 bg-gray-50 p-2 md:gap-4 md:p-4">
        {#if state.loading}
            <Skeleton class="h-45 w-full" />
        {:else}
            {#each state.deployments as data (data.id)}
                <DeploymentListItem {data} />
            {/each}
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
