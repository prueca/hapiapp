<script lang="ts">
    import { onMount } from 'svelte'
    import camera from '../Camera.state.svelte'

    let formattedTime = $derived(camera.dateTime.toLocaleTimeString())
    let formattedDate = $derived(camera.dateTime.toLocaleDateString())

    onMount(() => {
        const interval = setInterval(() => {
            camera.dateTime = new Date()
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    })
</script>

<div class="scan-result">
    <div class="content-wrapper">
        <div id="scan-result" class="text frosted">
            <div>{camera.scanResult}</div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .scan-result {
        @apply absolute top-[65%] left-[50%] min-w-50 -translate-x-1/2 -translate-y-1/2 text-white;
    }

    .text {
        @apply rounded-lg px-4 py-2 text-center text-sm;
    }
</style>
