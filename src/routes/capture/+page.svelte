<script lang="ts">
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

            const videoRect = videoElement.getBoundingClientRect()

            const canvasWidth = Math.floor(videoRect.width)
            const canvasHeight = Math.floor(videoRect.height)

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

            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

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

<div class="flex h-screen flex-col overflow-hidden bg-gray-950">
    <!-- CAMERA SECTION → Flex 2/4 of viewport (50%) -->
    <div class="relative flex h-[48vh] items-center justify-center bg-gray-800">
        <!-- OVERLAY HEADER -->
        <div
            id="overlay"
            class="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-linear-to-b from-black/70 via-transparent to-transparent p-4 backdrop-blur-sm sm:p-6"
        >
            <!-- App logo area -->
            <div class="flex items-center gap-3">
                <span class="w-6">
                    <img src={logo} alt="Selecta Logo" />
                </span>
                <span class="text-sm leading-none font-medium text-gray-200 sm:text-base"
                    >Hapi App</span
                >
            </div>

            <!-- Code of the Month -->
            <div class="flex flex-col items-end gap-1">
                <span class="text-base font-medium whitespace-nowrap text-white sm:text-lg"
                    >CABCONJAN2020</span
                >
            </div>
        </div>

        <div class="flex h-full w-full items-center justify-center overflow-hidden px-0">
            <video bind:this={videoElement} autoplay playsinline class="h-full w-full object-cover">
            </video>
        </div>

        <!-- ERROR MESSAGE -->
        {#if errorMessage}
            <div
                id="error-message"
                class="pointer-events-none absolute bottom-28 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 transform rounded-xl bg-red-500/95 px-6 py-3 text-center text-sm font-medium text-white shadow-lg backdrop-blur-md"
            >
                <p>{errorMessage}</p>
            </div>
        {/if}

        <!-- BOTTOM CONTROLS -->
        <div
            class="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-4 bg-linear-to-t from-black/80 via-black/30 to-transparent p-5 sm:p-6"
        >
            <button
                onclick={startCamera}
                type="button"
                class="btn rounded-lg border-none bg-white px-5 py-3 text-base leading-none font-semibold text-gray-800 active:scale-[0.98] active:bg-gray-50"
                >Start</button
            >
            <button
                onclick={saveFrame}
                disabled={!stream}
                type="button"
                class="btn rounded-lg border-none bg-white px-5 py-3 text-base leading-none font-semibold text-gray-800 active:scale-[0.98] active:bg-gray-50 disabled:opacity-40"
                >Save</button
            >
            <button
                onclick={() => {
                    stopCamera()
                    clearErrors()
                }}
                type="button"
                class="btn rounded-lg border-none bg-white px-5 py-3 text-base leading-none font-semibold text-gray-800 active:scale-[0.98] active:bg-gray-50"
                >Stop</button
            >
        </div>
    </div>

    <!-- SPLIT LINE -->
    <div class="h-px w-full bg-gray-800/50"></div>

    <!-- NEW UI SECTION → Flex 1/2 of viewport (remaining 50%) -->
    <div class="flex h-[48vh] flex-col items-center justify-center overflow-y-auto bg-gray-50 p-4">
        <!-- TODO: Add your new UI components here (tabs, lists, grids, etc.) -->
    </div>
</div>
