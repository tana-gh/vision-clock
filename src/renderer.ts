import * as ThreeState from './threestate'
import * as Animation  from './animation'

export const render = (
    threeState    : ThreeState.IThreeState,
    animationState: Animation.IAnimationState
) => {
    threeState.renderer.render(threeState.scene, threeState.camera)
}
