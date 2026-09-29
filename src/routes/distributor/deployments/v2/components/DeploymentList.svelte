<script lang="ts">
    import DeploymentListItem from './DeploymentListItem.svelte'
    import SearchDeployment from './SearchDeployment.svelte'
</script>

<div>
    <SearchDeployment />
    <div class="flex flex-col gap-2 bg-gray-50 p-2">
        <DeploymentListItem />
        <DeploymentListItem />
        <DeploymentListItem />
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
