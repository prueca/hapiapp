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

<div class="store-name">
    <div class="content-wrapper">
        <div class="text">
            <div>{camera.storeName}</div>
        </div>
        <div class="text date-time">
            <div>{formattedDate} {formattedTime}</div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .store-name {
        @apply absolute bottom-0 w-full -translate-y-24 text-white;
    }

    .text {
        @apply gap-1 px-4 text-sm not-last:mb-1;
    }

    .date-time {
        @apply text-xs;
    }
</style>
