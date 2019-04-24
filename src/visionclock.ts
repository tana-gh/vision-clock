import * as ThreeState from './threestate'

export interface IVisionClock {

}

export const load = (parent: HTMLElement) => {
    const threeState = ThreeState.create(400, 400)
    parent.appendChild(threeState.renderer.domElement)
    ThreeState.resizeRenderer(threeState, 400, 400)
    threeState.renderer.render(threeState.scene, threeState.camera)
    return threeState
}
