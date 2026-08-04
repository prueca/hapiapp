import logo from '$lib/assets/Selecta_Logo_2003.svg?url'
import { PUBLIC_APP_NAME } from '$env/static/public'
import { PUBLIC_CABCON_CODE } from '$env/static/public'

export default class Canvas {
    video: HTMLVideoElement
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    constructor(video: HTMLVideoElement) {
        this.video = video

        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

        const canvasWidth = this.video.clientWidth
        const canvasHeight = this.video.clientHeight

        if (canvasWidth === 0 || canvasHeight === 0) {
            throw new Error('Video not rendered yet. Please wait.')
        }

        this.canvas.width = canvasWidth
        this.canvas.height = canvasHeight
    }

    async draw(scanResult: string, storeName: string, dateTime: Date) {
        this.drawImage()
        this.drawTopOverlay()
        await this.drawLogo()
        this.drawAppName()
        this.drawCabconCode()
        this.drawBottomOverlay()
        this.drawStoreName(storeName)
        this.drawDateTime(dateTime)
        this.drawScanResult(scanResult)
    }

    async getImage(filename: string) {
        const dataURL = this.canvas.toDataURL('image/png')

        if (!dataURL || dataURL === 'data:,') {
            throw new Error('Failed to capture image with overlay.')
        }

        const blob = await (await fetch(dataURL)).blob()
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = filename

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    drawImage() {
        const { canvas, ctx, video } = this

        if (!ctx) {
            throw new Error('Could not create canvas context.')
        }

        const vw = video.videoWidth
        const vh = video.videoHeight

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

        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch)
    }

    drawTopOverlay() {
        const { ctx, canvas } = this

        const headerHeight = canvas.width > 0 ? Math.round(canvas.height * 0.15) : 80
        const gradient = ctx.createLinearGradient(0, 0, 0, headerHeight)

        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.75)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient

        ctx.fillRect(0, 0, canvas.width, headerHeight)
    }

    async drawLogo() {
        const { ctx, canvas } = this

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

        const paddingX = Math.floor(canvas.width * 0.04)
        const headerHeight = canvas.width > 0 ? Math.round(canvas.height * 0.15) : 80

        const LOGO_WIDTH = 24
        const logoAspect =
            logoImg.naturalWidth && logoImg.naturalHeight
                ? logoImg.naturalHeight / logoImg.naturalWidth
                : null
        const logoH = logoAspect
            ? Math.round(logoAspect * LOGO_WIDTH)
            : Math.round(headerHeight * 0.17)

        const headerCenterY = headerHeight * 0.3
        const logoTop = headerCenterY - logoH / 2

        ctx.drawImage(logoImg, paddingX, logoTop + 12, LOGO_WIDTH, logoH)
    }

    drawAppName() {
        const { ctx, canvas, appName } = this

        const paddingX = Math.floor(canvas.width * 0.04)
        const headerHeight = canvas.width > 0 ? Math.round(canvas.height * 0.15) : 80
        const headerCenterY = headerHeight * 0.3

        const fontSize = Math.max(headerHeight * 0.2, 16)
        const LOGO_WIDTH = 24

        ctx.font = `400 ${fontSize}px 'Geist', sans-serif`
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#f3f4f6'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
        ctx.shadowBlur = 4

        ctx.fillText(PUBLIC_APP_NAME, paddingX + LOGO_WIDTH + 12, headerCenterY + 12)
        ctx.shadowBlur = 0
    }

    drawCabconCode() {
        const { ctx, canvas } = this

        const paddingX = Math.floor(canvas.width * 0.04)
        const headerHeight = canvas.width > 0 ? Math.round(canvas.height * 0.15) : 80
        const headerCenterY = headerHeight * 0.3
        const codeFontSize = Math.max(headerHeight * 0.18, 14)

        ctx.font = `400 ${codeFontSize}px 'Geist', sans-serif`
        ctx.textAlign = 'right'
        ctx.fillStyle = '#ffffff'

        ctx.fillText(PUBLIC_CABCON_CODE, canvas.width - paddingX, headerCenterY + 12)
    }

    drawBottomOverlay() {
        const { ctx, canvas } = this

        const fadeHeight = 150
        const gradient = ctx.createLinearGradient(0, canvas.height - fadeHeight, 0, canvas.height)

        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.75)')
        ctx.fillStyle = gradient

        ctx.fillRect(0, canvas.height - fadeHeight, canvas.width, fadeHeight)
    }

    drawStoreName(storeName: string) {
        const { ctx, canvas } = this

        const paddingX = Math.floor(canvas.width * 0.04)
        const headerHeight = canvas.width > 0 ? Math.round(canvas.height * 0.15) : 80
        const fontSize = Math.max(headerHeight * 0.18, 14)

        ctx.font = `400 ${fontSize}px 'Geist', sans-serif`
        ctx.textAlign = 'left'
        ctx.fillStyle = '#ffffff'

        ctx.fillText(storeName, paddingX, canvas.height - 20)
    }

    drawDateTime(dateTime: Date) {
        const { ctx, canvas } = this

        const formattedTime = dateTime.toLocaleTimeString()
        const formattedDate = dateTime.toLocaleDateString()

        const headerHeight = canvas.width > 0 ? Math.round(canvas.height * 0.15) : 80
        const fontSize = Math.max(headerHeight * 0.18, 14)

        ctx.font = `400 ${fontSize}px 'Geist', sans-serif`
        ctx.textAlign = 'right'
        ctx.fillStyle = '#ffffff'
        ctx.fillText(`${formattedDate} ${formattedTime}`, canvas.width - 12, canvas.height - 20)
    }

    drawScanResult(result: string) {
        const { ctx, canvas } = this

        const paddingX = Math.floor(canvas.width * 0.04)
        const headerHeight = canvas.width > 0 ? Math.round(canvas.height * 0.15) : 80
        const fontSize = Math.max(headerHeight * 0.18, 14)

        ctx.font = `400 ${fontSize}px 'Geist', sans-serif`
        ctx.textAlign = 'left'
        ctx.fillStyle = '#ffffff'

        if (result !== 'Searching for barcode...') {
            ctx.fillText(result, paddingX, canvas.height - 45)
        }
    }
}
