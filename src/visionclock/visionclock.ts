import * as ThreeState from './three/threestate'
import * as Animation  from './animation'

export interface IVisionClock {

}

export const load = (parent: HTMLElement) => {
    const threeState = ThreeState.create(parent.clientWidth, parent.clientHeight)
    parent.appendChild(threeState.renderer.domElement)
    window.addEventListener('resize', () => 
        ThreeState.resizeRenderer(threeState, parent.clientWidth, parent.clientHeight))
    window.requestAnimationFrame(Animation.animate(threeState, {}))
    return threeState
}
