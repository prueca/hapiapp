<script lang="ts">
    import Camera from './components/Camera.svelte'
    import ScanResult from './components/ScanResult.svelte'
    import Controls from './components/Controls.svelte'
</script>

<div class="content-wrapper">
    <Camera />
    <ScanResult />
    <Controls />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
