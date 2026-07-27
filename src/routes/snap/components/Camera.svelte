<script lang="ts">
    import './Camera.css'
    import logo from '$lib/assets/Selecta_Logo_2003.svg?url'
    import { onMount } from 'svelte'
    import camera from '../Camera.state.svelte'

    onMount(() => camera.on())
</script>

<div class="content-wrapper">
    <div class="camera-section">
        <div class="overlay frosted">
            <!-- brand -->
            <div class="brand-logo">
                <span class="w-6">
                    <img src={logo} alt="Selecta Logo" />
                </span>
                <span class="brand-text">Hapi App</span>
            </div>

            <!-- cabcon code -->
            <div class="cabcon-code">CABCONJAN2020</div>
        </div>

        <!-- video -->
        <div class="video-wrapper">
            <video
                id="video"
                bind:this={camera.video}
                autoplay
                playsinline
                class="h-full w-full object-cover"
            >
            </video>
        </div>

        <!-- scan -->
        <div class="scan-box"></div>

        <!-- error message -->
        <div class="error-message" class:hidden={camera.error === ''}>
            <p>{camera.error}</p>
        </div>
    </div>
</div>
