import * as R           from 'ramda'
import * as ThreeState  from './three/threestate'
import * as PixiState   from './pixi/pixistate'
import * as ThreeObject from './three/threeobject'

export interface IAnimationState {
    start   ?: number
    before  ?: number
    total   ?: number
    progress?: number
}

export const animate = (
    threeState    : ThreeState.IThreeState,
    pixiState     : PixiState .IPixiState,
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

    animateThree(threeState, animationState)
    animatePixi (pixiState , animationState)

    window.requestAnimationFrame(animate(threeState, pixiState, animationState))
}

const animateThree = (
    threeState    : ThreeState.IThreeState,
    animationState: IAnimationState
) => {
    R.forEach((obj: ThreeObject.IThreeObject) => obj.updateByAnimation(obj, animationState))(threeState.objects)
    threeState.render(threeState)
}

const animatePixi = (
    pixiState     : PixiState.IPixiState,
    animationState: IAnimationState
) => {
    pixiState.application.ticker.update(animationState.total)
}
