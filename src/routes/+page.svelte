<script lang="ts">
    import Dock from './components/Dock.svelte'
    import TopBar from './components/TopBar'
    import MerchantName from './components/MerchantName.svelte'
    import TabbedContent from './components/TabbedContent.svelte'
    import ScanButton from './components/ScanButton.svelte'

    /**
     * You can access logged in user data via props
     *
     * ```
     * let { data } = $props()
     * const { user, account } = data
     * ```
     */
</script>

<div class="content-wrapper">
    <TopBar />
    <MerchantName />
    <TabbedContent />
    <Dock />
    <ScanButton />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
