import * as Animation  from '../animation'
import * as SceneState from './scenestate'

export interface IBehaviour {
    timestamp: number
    state    : string
    dispose  : () => void
}

export const updateByAnimation = (
    obj         : IBehaviour,
    sceneState  : SceneState.ISceneState,
    initialState: string,
    store       : any,
    behaviour   : (obj: IBehaviour, animation: Animation.IAnimationState, store: any) => void
) => (animation: Animation.IAnimationState) => {
    switch (obj.state) {
        case 'init':
            obj.state = initialState
            updateByAnimation(obj, sceneState, initialState, store, behaviour)(animation)
            return
        case 'terminate':
            sceneState.behaviours.delete(obj)
            obj.dispose()
            return
        default:
            behaviour(obj, animation, store)
    }
}

export const getTime = (obj: IBehaviour, animation: Animation.IAnimationState) => {
    return animation.now - obj.timestamp
}
