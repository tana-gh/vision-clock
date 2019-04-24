import * as THREE  from 'three'
import * as Render from './render'

export interface IObject3D {
    obj     : THREE.Object3D
    update  : (obj: THREE.Object3D, state: Render.IState) => void
    addScene: boolean
}
