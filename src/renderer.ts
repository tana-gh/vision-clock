import * as ThreeState from './threestate'

export const render = (
    threeState: ThreeState.IThreeState
) => {
    threeState.renderer.render(threeState.scene, threeState.camera)
}
