import * as THREE       from 'three'
import * as R           from 'ramda'
import * as Animation   from '../animation'
import * as Interaction from '../interaction'
import * as ThreeState  from './threestate'

export interface IThreeObject {
    elements: {
        [name: string]: THREE.Object3D
    }
    threeState          : ThreeState.IThreeState
    parent              : THREE.Object3D
    timestamp           : number
    state               : string
    updateByAnimation  ?: (animation  : Animation.IAnimationState) => void
    updateByInteraction?: (interaction: Interaction.IInteraction ) => void
    updateByTime       ?: (time       : Date                     ) => void
    dispose            ?: () => void
}

export const init = (threeState: ThreeState.IThreeState) => {
    R.pipe(
        objs => R.filter((obj: IThreeObject) => obj.state === 'init')(objs),
        R.forEach((obj: IThreeObject) =>
            obj.parent.add(...R.values(obj.elements))
        )
    )([...threeState.objects])
}

export const terminate = (threeState: ThreeState.IThreeState) => {
    R.pipe(
        objs => R.filter((obj: IThreeObject) => obj.state === 'terminate')(objs),
        R.forEach((obj: IThreeObject) => {
                threeState.objects.delete(obj)
                R.forEachObjIndexed(elem => obj.parent.remove(elem))(obj.elements)
            }
        ),
    )([...threeState.objects])
}

export const getTime = (obj: IThreeObject, animation: Animation.IAnimationState) => {
    return animation.now - obj.timestamp
}
