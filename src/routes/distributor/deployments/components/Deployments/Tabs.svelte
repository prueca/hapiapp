<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<script lang="ts">
    import ForDeployment from './ForDeployment'
    import AddDeployment from './AddDeployment'

    let activeTab = $state('A')
</script>

<div>
    <!-- Tabs -->
    <div class="tabs-lift tabs">
        <label class="tab flex-1 rounded-t">
            <input type="radio" name="tabs" bind:group={activeTab} value="A" />
            <span>For Deployment</span>
        </label>
        <label class="tab flex-1 rounded-t">
            <input type="radio" name="tabs" bind:group={activeTab} value="B" />
            <span>Add Deployment</span>
        </label>
    </div>

    <!-- Content -->
    <div
        class="content border-base-300 bg-base-100"
        class:rounded-tr={activeTab === 'A'}
        class:rounded-tl={activeTab === 'B'}
    >
        {#if activeTab === 'B'}
            <AddDeployment />
        {:else}
            <ForDeployment />
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .content {
        @apply overflow-hidden rounded-b border border-t-0;
    }
</style>
