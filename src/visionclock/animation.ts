import * as R           from 'ramda'
import * as PixiState   from './pixi/pixistate'
import * as ThreeState  from './three/threestate'
import * as ThreeObject from './three/threeobject'

export interface IAnimationState {
    start   ?: number
    before  ?: number
    total   ?: number
    progress?: number
}

export const animate = (
    pixiState     : PixiState .IPixiState,
    threeState    : ThreeState.IThreeState,
    animationState: IAnimationState
) => (timestamp: number) => {
    if (!animationState.start) {
        animationState.start = timestamp
    }
    if (!animationState.before) {
        animationState.before = timestamp
    }
    animationState.total    = timestamp - animationState.start
    animationState.progress = timestamp - animationState.before
    animationState.before   = timestamp

    const rawPixiTexture = animatePixi (pixiState , animationState)
    animateThree(threeState, animationState, rawPixiTexture)

    window.requestAnimationFrame(animate(pixiState, threeState, animationState))
}

const animatePixi = (
    pixiState     : PixiState.IPixiState,
    animationState: IAnimationState
) => {
    return pixiState.render(pixiState, animationState)
}

const animateThree = (
    threeState    : ThreeState.IThreeState,
    animationState: IAnimationState,
    rawPixiTexture: Uint8Array | Uint8ClampedArray
) => {
    R.forEach((obj: ThreeObject.IThreeObject) => obj.updateByAnimation(obj, animationState))(threeState.objects)
    threeState.render(threeState, animationState, rawPixiTexture)
}
