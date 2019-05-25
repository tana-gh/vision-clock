import * as THREE      from 'three'
import * as R          from 'ramda'
import * as Animation  from '../animation'
import * as SceneState from './scenestate'
import * as Behaviour  from './behaviour'

export interface IDisplayObject extends Behaviour.IBehaviour {
    rootElement: THREE.Object3D
    elements   : {
        [name: string]: THREE.Object3D
    }
}

export const updateByAnimation = (
    obj         : IDisplayObject,
    sceneState  : SceneState.ISceneState,
    parent      : THREE.Object3D,
    initialState: string,
    store       : any,
    behaviour   : (obj: IDisplayObject, animation: Animation.IAnimationState, store: any) => void
) => (animation: Animation.IAnimationState) => {
    switch (obj.state) {
        case 'init':
            sceneState.objects.add(obj)
            parent.add(obj.rootElement)
            obj.state = initialState
            updateByAnimation(obj, sceneState, parent, initialState, store, behaviour)(animation)
            return
        case 'terminate':
            parent.remove(obj.rootElement)
            sceneState.objects.delete(obj)
            obj.dispose()
            return
        default:
            behaviour(obj, animation, store)
    }
}

export const getTime = (obj: IDisplayObject, animation: Animation.IAnimationState) =>
    Behaviour.getTime(obj, animation)
