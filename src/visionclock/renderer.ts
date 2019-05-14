import * as PixiState   from './pixi/pixistate'
import * as ThreeState  from './three/threestate'
import * as Animation   from './animation'

export const render = (
    pixiState     : PixiState .IPixiState,
    threeState    : ThreeState.IThreeState
) => (
    animationState: Animation.IAnimationState
) => {
    const rawPixiTexture = renderPixi(pixiState , animationState)
    renderThree(threeState, animationState, rawPixiTexture)
}

const renderPixi = (
    pixiState     : PixiState.IPixiState,
    animationState: Animation.IAnimationState
) => {
    return pixiState.render!(animationState)
}

const renderThree = (
    threeState    : ThreeState.IThreeState,
    animationState: Animation.IAnimationState,
    rawPixiTexture: Uint8Array | Uint8ClampedArray
) => {
    threeState.render!(animationState, rawPixiTexture)
}
