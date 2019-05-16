import * as THREE       from 'three'
import * as R           from 'ramda'
import * as Animation   from '../animation'
import * as Interaction from '../interaction'
import * as SceneState  from './scenestate'

export interface IDisplayObject {
    elements: {
        [name: string]: THREE.Object3D
    }
    sceneState          : SceneState.ISceneState
    parent              : THREE.Object3D
    timestamp           : number
    state               : string
    updateByAnimation  ?: (animation  : Animation.IAnimationState) => void
    updateByInteraction?: (interaction: Interaction.IInteraction ) => void
    updateByTime       ?: (time       : Date                     ) => void
    dispose            ?: () => void
}

export const init = (sceneState: SceneState.ISceneState) => {
    R.pipe(
        objs => R.filter((obj: IDisplayObject) => obj.state === 'init')(objs),
        R.forEach((obj: IDisplayObject) =>
            obj.parent.add(...R.values(obj.elements))
        )
    )([...sceneState.objects])
}

export const terminate = (sceneState: SceneState.ISceneState) => {
    R.pipe(
        objs => R.filter((obj: IDisplayObject) => obj.state === 'terminate')(objs),
        R.forEach((obj: IDisplayObject) => {
                sceneState.objects.delete(obj)
                R.forEachObjIndexed(elem => obj.parent.remove(elem))(obj.elements)
                obj.dispose!()
            }
        ),
    )([...sceneState.objects])
}

export const getTime = (obj: IDisplayObject, animation: Animation.IAnimationState) => {
    return animation.now - obj.timestamp
}
