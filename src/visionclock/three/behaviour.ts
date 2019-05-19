import * as Animation from '../animation'

export interface IBehaviour {
    timestamp: number
    state    : string
    dispose  : () => void
}

export const updateByAnimation = (
    obj         : IBehaviour,
    initialState: string,
    behaviour   : (obj: IBehaviour, animation: Animation.IAnimationState) => void
) => (animation: Animation.IAnimationState) => {
    switch (obj.state) {
        case 'init':
            obj.state = initialState
            updateByAnimation(obj, initialState, behaviour)(animation)
            return
        case 'terminate':
            obj.dispose()
            return
        default:
            behaviour(obj, animation)
    }
}

export const getTime = (obj: IBehaviour, animation: Animation.IAnimationState) => {
    return animation.now - obj.timestamp
}
