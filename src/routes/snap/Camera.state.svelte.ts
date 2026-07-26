import logo from '$lib/assets/Selecta_Logo_2003.svg?url'
import _ from 'lodash'

class Camera {
    video: HTMLVideoElement | undefined
    stream: MediaStream | null = $state(null)
    store: string = $state('')
    error: string = $state('')

    async on() {
        try {
            this.error = ''
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })

            if (this.video && this.stream) {
                this.video.srcObject = this.stream
            }
        } catch (err) {
            const errObj = err as DOMException

            switch (errObj?.name) {
                case 'NotAllowedError':
                    this.error = 'Camera access denied. Please allow camera access and try again.'
                    break
                case 'NotFoundError':
                    this.error = 'No camera device was found.'
                    break
                case 'NotReadableError':
                    this.error = 'Could not access camera — it may be in use by another app.'
                    break
                default:
                    this.error = `Camera error: ${errObj?.message || 'Unknown error'}`
            }

            console.error('Error accessing camera:', err)
        }
    }

    async capture() {
        try {
            if (!this.video || !this.stream) {
                this.error = 'Camera is not active. Please start the camera first.'
                return
            }

            const store = _.chain(this.store).trim().replace(/\s+/g, '_').toLower().value()

            if (!store) {
                this.error = 'Store name is must be provided.'
                return
            }

            const canvasWidth = this.video.clientWidth
            const canvasHeight = this.video.clientHeight

            if (canvasWidth === 0 || canvasHeight === 0) {
                this.error = 'Video not rendered yet. Please wait.'
                return
            }

            const canvas = document.createElement('canvas')
            canvas.width = canvasWidth
            canvas.height = canvasHeight

            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

            if (!ctx) {
                this.error = 'Could not create canvas context.'
                return
            }

            const vw = this.video.videoWidth
            const vh = this.video.videoHeight

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

            ctx.drawImage(this.video, sx, sy, sw, sh, 0, 0, cw, ch)

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
                this.error = 'Failed to capture image with overlay.'
                return
            }

            const blob = await (await fetch(dataURL)).blob()
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `captured_${store}_${Date.now()}.png`

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            this.error = ''
        } catch (err) {
            console.error('Save failed:', err)
            this.error = 'Failed to save image. Please try again.'
        }
    }
}

export default new Camera()
