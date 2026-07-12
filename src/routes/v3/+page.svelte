<script lang="ts">
    import Dock from './components/Dock.svelte'
    import TopBar from './components/TopBar'
    import MerchantName from './components/MerchantName.svelte'
    // import ScanButton from './components/ScanButton.svelte'
    import TabbedContent from './components/TabbedContent.svelte'
    import FloatingScanButton from './components/FloatingScanButton.svelte'
</script>

<div>
    <MerchantName />
    <TabbedContent />
    <Dock />
    <FloatingScanButton />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
