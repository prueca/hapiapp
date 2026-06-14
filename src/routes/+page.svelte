<script lang="ts">
    import Dock from './components/Dock.svelte'
    import Navbar from './components/Navbar.svelte'
    import TabbedContent from './components/TabbedContent.svelte'
    import FreezerList from './components/Freezers/List.svelte'
</script>

<div>
    <Navbar />
    <TabbedContent />
    <FreezerList />
    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
