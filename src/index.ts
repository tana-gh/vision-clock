import * as VisionClock from './visionclock/visionclock'
import '../assets/scss/style.scss'

declare global {
    interface Window {
        visionClockState: VisionClock.IVisionClockState | undefined
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const visionclock = document.getElementById('visionclock')
    window.visionClockState = visionclock ? VisionClock.load(visionclock) : undefined
})
