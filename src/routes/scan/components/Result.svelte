<script lang="ts">
    import camera from '../Camera.state.svelte'
</script>

<div class="content-wrapper">
    <div class="text-wrapper">
        {camera.scanResult}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .text-wrapper {
        @apply my-8 text-center;
    }
</style>
