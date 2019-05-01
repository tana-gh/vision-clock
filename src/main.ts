import './stylus/style.styl'
import * as VisionClock from './visionclock/visionclock'

window.addEventListener('load', () => {
    (<any>window).visionClockState = VisionClock.load(document.getElementById('visionclock')!)
})
