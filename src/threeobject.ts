import * as THREE       from 'three'
import * as Animation   from './animation'
import * as Interaction from './interaction'

export interface IThreeObject {
    obj   : THREE.Object3D,
    updateByAnimation: (
        obj      : THREE.Object3D,
        animation: Animation.IAnimationState
    ) => THREE.Object3D,
    updateByInteraction: (
        obj        : THREE.Object3D,
        interaction: Interaction.IInteraction
    ) => THREE.Object3D
}
