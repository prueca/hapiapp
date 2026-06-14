<script lang="ts">
    import Dock from './components/Dock.svelte'
    import Navbar from './components/Navbar.svelte'
    import TabbedContent from './components/TabbedContent.svelte'
</script>

<div>
    <Navbar />
    <TabbedContent />
    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
