import * as THREE         from 'three'
import * as Rx            from 'rxjs'
import * as Animation     from '../../animation'
import * as SceneState    from '../scenestate'
import * as DisplayObject from '../displayobject'
import * as ShaderObject  from './shaderobject'
import * as C             from '../../utils/constants'

export const create = (
    timestamp : number,
    animations: Rx.Observable<Animation.IAnimationState>,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    material  : THREE.Material,
    position  : THREE.Vector3,
    velocity  : THREE.Vector3,
    scale     : number,
    color     : THREE.Color,
    lightness : number
): ShaderObject.IShaderObject => {
    return ShaderObject.create(
        timestamp,
        animations,
        'fade-in',
        updateByAnimation(velocity, color, lightness),
        sceneState,
        parent,
        position,
        scale,
        scale,
        {
            a_coord: C.shaderObjectParams.a_coord
        },
        {
            a_coord: C.shaderObjectParams.a_coordDim
        },
        material
    )
}

const updateByAnimation = (velocity: THREE.Vector3, color: THREE.Color, lightness: number) => 
(obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState, store: any) => {
    const sobj = <ShaderObject.IShaderObject>obj
    
    switch (obj.state) {
        case 'fade-in':
            {
                const time      = DisplayObject.getTime(obj, animation)
                const timeRatio = time / C.treeObjectParams.fadeInTime

                const c = new THREE.Color(1.0, 1.0, 1.0).multiplyScalar(lightness * timeRatio)
                sobj.setUniform('u_color', [ c.r, c.g, c.b, 1.0 ])

                if (time > C.treeObjectParams.fadeInTime) {
                    obj.state = 'main'
                }
            }
            return
        case 'main':
            {
                const c = new THREE.Color(1.0, 1.0, 1.0).multiplyScalar(lightness)
                sobj.setUniform('u_color', [ c.r, c.g, c.b, 1.0 ])
            }
            return
        case 'fade-out':
            {
                if (store.beginTime === undefined) {
                    store.beginTime = DisplayObject.getTime(obj, animation)
                }

                const time      = DisplayObject.getTime(obj, animation) - store.beginTime
                const timeRatio = 1.0 - time / C.treeObjectParams.fadeOutTime

                obj.rootElement.position.add(velocity)

                const c = new THREE.Color(1.0, 1.0, 1.0).lerp(color, timeRatio).multiplyScalar(lightness * timeRatio)
                sobj.setUniform('u_color', [ c.r, c.g, c.b, 1.0 ])

                if (time > C.treeObjectParams.fadeOutTime) {
                    obj.state = 'terminate'
                }
            }
            return
        default:
            throw 'Invalid state'
    }
}
