<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<script lang="ts">
    import DeploymentList from './DeploymentList.svelte'
    import CreateDeployment from './CreateDeployment.svelte'

    let activeTab = $state<'A' | 'B'>('B')
</script>

<div class="px-4">
    <!-- Tabs -->
    <div class="tabs-lift tabs">
        <label class="tab flex-1 rounded-t-lg">
            <input type="radio" name="tabs" bind:group={activeTab} value="A" />
            <span>For Deployment</span>
        </label>
        <label class="tab flex-1 rounded-t-lg">
            <input type="radio" name="tabs" bind:group={activeTab} value="B" />
            <span>Add Deployment</span>
        </label>
    </div>

    <!-- Content -->
    <div
        class="overflow-hidden rounded-b-lg border border-t-0 border-base-300 bg-base-100"
        class:rounded-tl-lg={activeTab === 'B'}
        class:rounded-tr-lg={activeTab === 'A'}
    >
        {#if activeTab === 'A'}
            <DeploymentList />
        {:else if activeTab === 'B'}
            <CreateDeployment />
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
