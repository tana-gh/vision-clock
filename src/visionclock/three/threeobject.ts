import * as THREE       from 'three'
import * as Animation   from '../animation'
import * as Interaction from '../interaction'

export interface IThreeObject {
    elements: {
        [name: string]: THREE.Object3D
    },
    updateByAnimation  : (obj: IThreeObject, animation  : Animation.IAnimationState) => void,
    updateByInteraction: (obj: IThreeObject, interaction: Interaction.IInteraction ) => void,
    updateByTime       : (obj: IThreeObject, time       : Date                     ) => void
}
