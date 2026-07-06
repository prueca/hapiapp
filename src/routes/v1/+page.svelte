<script lang="ts">
    import Dock from './components/Dock.svelte'
    import TopBar from './components/TopBar'
    import TabbedContent from './components/TabbedContent.svelte'
    import FreezerList from './components/FreezerList'
</script>

<div>
    <TopBar />
    <TabbedContent />
    <FreezerList />
    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
