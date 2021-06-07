import * as THREE          from 'three'
import * as Rx             from 'rxjs'
import * as Animation      from '../../animation'
import * as SceneState     from '../scenestate'
import * as DisplayObject  from '../displayobject'
import * as CustomGeometry from '../customgeometry'
import * as C              from '../../utils/constants'

export interface IShaderObject extends DisplayObject.IDisplayObject {
    setUniform: (name: string, value: any) => void
}

export const create = (
    timestamp        : number,
    animations       : Rx.Observable<Animation.IAnimationState>,
    initialState     : string,
    updateByAnimation: (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState, store: any) => void,
    sceneState       : SceneState.ISceneState,
    parent           : THREE.Object3D,
    position         : THREE.Vector3,
    width            : number,
    height           : number,
    attributes       : { [name: string]: number[] },
    attributeDims    : { [name: string]: number   },
    material         : THREE.Material
): IShaderObject => {
    const vertices = C.shaderObjectVertices
    const indices  = C.shaderObjectIndices
    const geometry  = CustomGeometry.create(vertices, indices, attributes, attributeDims)
    const rectangle = new THREE.Mesh(geometry, material)
    rectangle.scale   .set(width, height, 1.0)
    rectangle.position.set(position.x, position.y, position.z)
    
    const obj: IShaderObject = {
        rootElement: rectangle,
        elements   : {
            rectangle
        },
        timestamp,
        state: 'init',
        dispose() {
            subscription.unsubscribe()
            geometry.dispose()
            material.dispose()
        },
        setUniform(name, value) {
            if (material instanceof THREE.ShaderMaterial) {
                material.uniforms[name].value = value
            }
        }
    }
    sceneState.objects.add(obj)

    const store = {}

    const subscription = animations.subscribe(
        DisplayObject.updateByAnimation(obj, sceneState, parent, initialState, store, updateByAnimation)
    )

    return obj
}
