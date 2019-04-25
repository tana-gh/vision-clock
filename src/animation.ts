import * as ThreeState from './threestate'
import * as Renderer   from './renderer'

export interface IAnimationState {
    start?   : number
    before?  : number
    total?   : number
    progress?: number
}

export const animate = (
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

    Renderer.render(threeState, animationState)

    window.requestAnimationFrame(animate(threeState, animationState))
}
