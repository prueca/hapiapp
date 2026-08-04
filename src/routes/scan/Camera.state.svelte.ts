import { BarcodeDetector } from 'barcode-detector'
import Canvas from './Canvas.state.svelte'
import _ from 'lodash'

class Camera {
    video: HTMLVideoElement | undefined
    stream: MediaStream | null = $state(null)

    storeName: string = $state('')
    dateTime: Date = $state(new Date())

    scanResult: string = $state('Searching for barcode...')
    error: string = $state('')

    private lastTime = 0
    private interval = 1000

    async on() {
        try {
            this.error = ''
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })

            if (this.video && this.stream) {
                this.video.srcObject = this.stream
                const scan = this.scan.bind(this)
                requestAnimationFrame(scan)
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

    async scan(timestamp: number) {
        if (!this.lastTime) {
            this.lastTime = timestamp
        }

        const elapsed = timestamp - this.lastTime

        if (elapsed >= this.interval) {
            this.lastTime = timestamp - (elapsed % this.interval)

            const detector = new BarcodeDetector({
                formats: ['any']
            })

            const video = document.querySelector<HTMLVideoElement>('#video')

            if (!video) {
                return
            }

            await new Promise<void>((resolve) => {
                if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
                    resolve()
                } else {
                    video.addEventListener('loadeddata', () => resolve(), { once: true })
                }
            })

            const [result] = await detector.detect(video)

            if (result) {
                this.scanResult = result.rawValue
            }
        }

        const scan = this.scan.bind(this)

        requestAnimationFrame(scan)
    }

    async capture() {
        try {
            if (!this.video || !this.stream) {
                this.error = 'Camera is not active. Please start the camera first.'
                return
            }

            const storeName = _.chain(this.storeName).trim().replace(/\s+/g, '_').toLower().value()

            if (!storeName) {
                this.error = 'Store name is required.'
                return
            }

            const filename = `captured_${storeName}_${Date.now()}.png`
            const canvas = new Canvas(this.video)

            await canvas.draw(this.scanResult, this.storeName, this.dateTime)
            await canvas.getImage(filename)

            this.error = ''
        } catch (err) {
            console.error('Save failed:', err)
            this.error = 'Failed to save image. Please try again.'
        }
    }
}

export default new Camera()
