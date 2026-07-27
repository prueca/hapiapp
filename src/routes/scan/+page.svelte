<script lang="ts">
    import Camera from './components/Camera.svelte'
    import Controls from './components/Controls.svelte'
    import StoreName from './components/StoreName.svelte'
    import ScanResult from './components/ScanResult.svelte'
</script>

<div class="relative">
    <Camera />
    <ScanResult />
    <StoreName />
    <Controls />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
