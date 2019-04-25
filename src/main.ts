import './stylus/style.styl'
import * as VisionClock from './visionclock'

window.addEventListener('load', () => {
    (<any>window).threeState = VisionClock.load(document.getElementById('visionclock')!)
})
