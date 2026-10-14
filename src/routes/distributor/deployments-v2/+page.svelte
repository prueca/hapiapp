<script lang="ts">
    import Nav from '../components/Nav.svelte'
    import DeploymentsOverview from '../components/DeploymentsOverview.svelte'
    // import Dashboard from './components/Dashboard.svelte'
    import DeploymentTabs from './components/DeploymentTabs.svelte'
</script>

<div class="content-wrapper">
    <Nav />
    <DeploymentsOverview />
    <!-- <Dashboard /> -->
    <DeploymentTabs />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
