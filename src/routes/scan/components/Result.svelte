<script lang="ts">
    import { onMount } from 'svelte'
    import camera from '../Camera.state.svelte'

    let time = $state(new Date())
    let formattedTime = $derived(time.toLocaleTimeString())
    let formattedDate = $derived(time.toLocaleDateString())

    onMount(() => {
        const interval = setInterval(() => {
            time = new Date()
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    })
</script>

<div class="store-name">
    <div class="content-wrapper">
        <div class="flex">
            <div>{formattedDate} {formattedTime}</div>
        </div>
        <div class="flex">
            <div>{camera.scanResult}</div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .store-name {
        @apply absolute bottom-0 w-full -translate-y-24 text-white;
    }

    .flex {
        @apply gap-1 px-4 text-sm not-last:mb-1;
    }
</style>
