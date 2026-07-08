<script lang="ts">
    import Dock from './components/Dock.svelte'
    import TopBar from './components/TopBar'
    import MerchantName from './components/MerchantName.svelte'
    import TabbedContent from './components/TabbedContent.svelte'
    import ScanButton from './components/ScanButton.svelte'
</script>

<div>
    <TopBar />
    <MerchantName />
    <TabbedContent />
    <Dock />
    <ScanButton />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
