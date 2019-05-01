import * as R           from 'ramda'
import * as ThreeState  from './three/threestate'
import * as ThreeObject from './three/threeobject'
import * as Renderer    from './renderer'

export interface IAnimationState {
    start   ?: number
    before  ?: number
    total   ?: number
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

    R.forEach((obj: ThreeObject.IThreeObject) => obj.updateByAnimation(obj, animationState))(threeState.objects)
    Renderer.render(threeState)

    window.requestAnimationFrame(animate(threeState, animationState))
}
