<script lang="ts">
    import './Camera.css'
    import logo from '$lib/assets/Selecta_Logo_2003.svg?url'
    import camera from '../Camera.state.svelte'
    import { onMount } from 'svelte'

    onMount(() => camera.on())

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

<div class="content-wrapper">
    <div class="camera-view">
        <!-- brand and cabcon code -->
        <div class="top-overlay frosted">
            <div class="brand-logo">
                <span class="w-6">
                    <img src={logo} alt="Selecta Logo" />
                </span>
                <span class="brand-text">Hapi App</span>
            </div>
            <div class="cabcon-code">CABCONJAN2020</div>
        </div>

        <!-- video -->
        <video id="video" bind:this={camera.video} autoplay playsinline class="video"></video>

        <!-- scan guide -->
        <div class="px-4">
            <div class="scan-guide"></div>
        </div>

        <!-- store name and date -->
        <div class="bottom-overlay frosted">
            <div class="store-name">{camera.storeName}</div>
            <div class="date-time">{`${formattedDate} ${formattedTime}`}</div>
        </div>
    </div>
</div>
