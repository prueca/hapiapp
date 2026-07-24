<script lang="ts">
    import Camera from './components/Camera.svelte'
    import Controls from './components/Controls.svelte'
    import StoreName from './components/StoreName.svelte'
</script>

<div class="relative">
    <Camera />
    <StoreName />
    <Controls />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
