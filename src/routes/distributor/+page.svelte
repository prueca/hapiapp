<script lang="ts">
    import Dock from '../components/Dock.svelte'
    import TopBar from '../components/TopBar'
    import Dashboard from './components/Dashboard.svelte'
    import WelcomeBanner from './components/WelcomeBanner.svelte'
</script>

<div class="content-wrapper">
    <TopBar />
    <WelcomeBanner />
    <Dashboard />
    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
