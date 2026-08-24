<script lang="ts">
    import Dock from '../components/Dock.svelte'
    import TopBar from '../components/TopBar'
    import Dashboard from './components/Dashboard.svelte'
    import WelcomeBanner from './components/WelcomeBanner.svelte'

    let { data } = $props()
</script>

<div class="content-wrapper">
    <TopBar />
    <WelcomeBanner {data} />
    <Dashboard />
    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
