<script lang="ts">
    import Dock from '../components/Dock.svelte'
    import TopBar from '../components/TopBar'
    import Dashboard from './components/Dashboard.svelte'
    import WelcomeBanner from './components/WelcomeBanner.svelte'
    import accountTypes from '$lib/config/account.types'
</script>

<div class="content-wrapper">
    <div class="mb-17">
        <TopBar />
        <WelcomeBanner />
        <Dashboard />
    </div>
    <Dock accountType={accountTypes.DISTRIBUTOR} />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
