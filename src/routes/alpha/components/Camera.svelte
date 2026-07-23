<script lang="ts">
    import './Camera.css'
    import Icon from '@iconify/svelte'
    import logo from '$lib/assets/Selecta_Logo_2003.svg?url'

    // Reference to the video element in the DOM, allowing us to set its srcObject.
    let videoElement: HTMLVideoElement | undefined

    // Holds the MediaStream object returned by getUserMedia.
    // If null/undefined, it means the camera is not active or permission was denied.
    let stream = $state<MediaStream | null>(null)

    // Track error state for user feedback
    let errorMessage = $state('')

    /**
     * Attempts to start the camera and get user media access.
     */
    async function startCamera() {
        try {
            errorMessage = ''
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })

            if (videoElement && stream) {
                videoElement.srcObject = stream
            }
        } catch (err) {
            const errObj = err as DOMException

            switch (errObj?.name) {
                case 'NotAllowedError':
                    errorMessage = 'Camera access denied. Please allow camera access and try again.'
                    break
                case 'NotFoundError':
                    errorMessage = 'No camera device was found.'
                    break
                case 'NotReadableError':
                    errorMessage = 'Could not access camera — it may be in use by another app.'
                    break
                default:
                    errorMessage = `Camera error: ${errObj?.message || 'Unknown error'}`
            }

            console.error('Error accessing camera:', err)
        }
    }

    async function saveFrame() {
        try {
            if (!videoElement || !stream) {
                errorMessage = 'Camera is not active. Please start the camera first.'
                return
            }

            const canvasWidth = videoElement.clientWidth
            const canvasHeight = videoElement.clientHeight

            if (canvasWidth === 0 || canvasHeight === 0) {
                errorMessage = 'Video not rendered yet. Please wait.'
                return
            }

            const canvas = document.createElement('canvas')
            canvas.width = canvasWidth
            canvas.height = canvasHeight

            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

            if (!ctx) {
                errorMessage = 'Could not create canvas context.'
                return
            }

            // ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

            const vw = videoElement.videoWidth
            const vh = videoElement.videoHeight

            const cw = canvas.width
            const ch = canvas.height

            const videoAspect = vw / vh
            const canvasAspect = cw / ch

            let sx = 0
            let sy = 0
            let sw = vw
            let sh = vh

            if (videoAspect > canvasAspect) {
                // Video is wider
                sw = vh * canvasAspect
                sx = (vw - sw) / 2
            } else {
                // Video is taller
                sh = vw / canvasAspect
                sy = (vh - sh) / 2
            }

            ctx.drawImage(videoElement, sx, sy, sw, sh, 0, 0, cw, ch)

            const paddingX = Math.floor(canvasWidth * 0.04)
            const headerHeight = canvasWidth > 0 ? Math.round(canvasHeight * 0.15) : 80

            const gradient = ctx.createLinearGradient(0, 0, 0, headerHeight)
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.75)')
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvasWidth, headerHeight)

            const logoImg = new Image()
            logoImg.src = logo

            if (typeof logoImg.decode === 'function') {
                await logoImg.decode()
            } else {
                await new Promise<void>((resolve) => {
                    logoImg.onload = () => resolve()
                    setTimeout(() => resolve(), 500)
                })
            }

            const LOGO_WIDTH = 24
            const logoAspect =
                logoImg.naturalWidth && logoImg.naturalHeight
                    ? logoImg.naturalHeight / logoImg.naturalWidth
                    : null
            const logoH = logoAspect
                ? Math.round(logoAspect * LOGO_WIDTH)
                : Math.round(headerHeight * 0.17)

            // Shared Y-axis for vertical center alignment of all header elements
            const headerCenterY = headerHeight * 0.3
            const logoTop = headerCenterY - logoH / 2

            ctx.drawImage(logoImg, paddingX, logoTop, LOGO_WIDTH, logoH)

            const appTextFontSize = Math.max(headerHeight * 0.2, 16)
            ctx.font = `400 ${appTextFontSize}px 'Geist', sans-serif`
            ctx.textBaseline = 'middle'
            ctx.fillStyle = '#f3f4f6'
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
            ctx.shadowBlur = 4
            // Hapi App vertically centered with logo center
            ctx.fillText('Hapi App', paddingX + LOGO_WIDTH + 12, headerCenterY)
            ctx.shadowBlur = 0

            const codeFontSize = Math.max(headerHeight * 0.18, 14)
            ctx.font = `400 ${codeFontSize}px 'Geist', sans-serif`
            ctx.textAlign = 'right'
            ctx.fillStyle = '#ffffff'
            // Align CABCONJAN2020 to same centerY as logo and Hapi App
            ctx.fillText('CABCONJAN2020', canvasWidth - paddingX, headerCenterY)

            ctx.textAlign = 'start'

            const dataURL = canvas.toDataURL('image/png')

            if (!dataURL || dataURL === 'data:,') {
                errorMessage = 'Failed to capture image with overlay.'
                return
            }

            const link = document.createElement('a')
            link.href = dataURL
            link.download = `captured_${Date.now()}.png`

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            errorMessage = ''
        } catch (err) {
            console.error('Save failed:', err)
            errorMessage = 'Failed to save image. Please try again.'
        }
    }

    function stopCamera() {
        if (stream) {
            const tracks = stream.getTracks()
            tracks.forEach((track: MediaStreamTrack) => track.stop())
            stream = null
        }
    }

    function clearErrors() {
        errorMessage = ''
    }
</script>

<div class="content-wrapper">
    <div class="camera-section">
        <div class="overlay">
            <!-- brand -->
            <div class="brand-logo">
                <span class="w-6">
                    <img src={logo} alt="Selecta Logo" />
                </span>
                <span class="brand-text">Hapi App</span>
            </div>

            <!-- cabcon-code -->
            <div class="cabcon-code">CABCONJAN2020</div>
        </div>

        <!-- video -->
        <div class="video-wrapper">
            <video bind:this={videoElement} autoplay playsinline class="h-full w-full object-cover">
            </video>
        </div>

        <!-- error message -->
        <div class="error-message" class:hidden={errorMessage === ''}>
            <p>{errorMessage}</p>
        </div>

        <!-- controls -->
        <div class="controls">
            <!-- camera on -->
            <div class="btn-wrapper">
                <button class="btn btn-circle btn-lg" onclick={startCamera} type="button">
                    <div class="icon">
                        <Icon icon="mdi-light:camera" width="32" />
                    </div>
                </button>
                <div class="btn-label">Camera On</div>
            </div>
            <!-- capture -->
            <div class="btn-wrapper">
                <button class="btn btn-circle btn-lg" type="button" onclick={saveFrame}>
                    <div class="icon">
                        <Icon icon="material-symbols-light:camera-outline-rounded" width="32" />
                    </div>
                </button>
                <div class="btn-label">Capture</div>
            </div>
            <!-- camera off -->
            <div class="btn-wrapper">
                <button
                    class="btn btn-circle btn-lg"
                    type="button"
                    onclick={() => {
                        stopCamera()
                        clearErrors()
                    }}
                >
                    <div class="icon">
                        <Icon icon="fluent:camera-off-20-regular" width="32" />
                    </div>
                </button>
                <div class="btn-label">Camera Off</div>
            </div>
        </div>
    </div>
</div>
