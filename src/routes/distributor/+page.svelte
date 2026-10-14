<script lang="ts">
    import Nav from './components/Nav.svelte'
    import DeploymentsOverview from './components/DeploymentsOverview.svelte'
    import Dashboard from './components/Dashboard.svelte'
</script>

<div class="content-wrapper">
    <Nav />
    <DeploymentsOverview />
    <Dashboard />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
