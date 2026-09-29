<script lang="ts">
    import DeploymentListItem from './DeploymentListItem.svelte'
    import SearchDeployment from './SearchDeployment.svelte'
</script>

<div>
    <SearchDeployment />
    <div class="flex flex-col gap-4 bg-gray-50 p-4">
        <DeploymentListItem />
        <DeploymentListItem />
        <DeploymentListItem />
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
