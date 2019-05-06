import './stylus/style.styl'
import * as VisionClock from './visionclock/visionclock'

window.addEventListener('load', () => {
    window['visionClockState'] = VisionClock.load(document.getElementById('visionclock')!)
})
