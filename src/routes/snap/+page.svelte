<script lang="ts">
    import Camera from './components/Camera.svelte'
    import Controls from './components/Controls.svelte'
    import Result from './components/Result.svelte'
</script>

<div class="relative">
    <Camera />
    <Result />
    <Controls />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
