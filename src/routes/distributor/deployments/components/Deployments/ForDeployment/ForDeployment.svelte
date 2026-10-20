<script lang="ts">
    import { onMount } from 'svelte'
    import ListItem from './ListItem.svelte'
    import Search from './Search.svelte'
    import Skeleton from '../../../../../components/Skeleton.svelte'
    import deploymentList from './deployment.list.svelte'

    onMount(() => deploymentList.fetch())
</script>

<div class="flex flex-col">
    <Search />
    <div class="flex flex-col gap-4 bg-(--c6) p-4">
        {#if deploymentList.loading}
            <Skeleton class="h-46" />
        {:else}
            {#each deploymentList.items as deployment (deployment.id)}
                <ListItem {deployment} />
            {/each}
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
