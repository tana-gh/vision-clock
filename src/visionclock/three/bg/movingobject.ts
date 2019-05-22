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
    velocity  : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => THREE.Vector3,
    scale     : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => number,
    color     : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => THREE.Color,
    alpha     : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => number,
    isAlive   : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => boolean
) => {
    return ShaderObject.create(
        timestamp,
        animations,
        'main',
        updateByAnimation(velocity, scale, color, alpha, isAlive),
        sceneState,
        parent,
        position,
        1.0,
        1.0,
        {
            a_coord: C.shaderObjectParams.a_coord
        },
        {
            a_coord: C.shaderObjectParams.a_coordDim
        },
        material
    )
}

const updateByAnimation = (
    velocity: (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => THREE.Vector3,
    scale   : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => number,
    color   : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => THREE.Color,
    alpha   : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => number,
    isAlive : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => boolean
) => (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => {
    const sobj = <ShaderObject.IShaderObject>obj
    
    switch (sobj.state) {
        case 'main':
            {
                sobj.rootElement.position.add(velocity(obj, animation))
                if (!isAlive(sobj, animation)) {
                    sobj.state = 'terminate'
                    return
                }

                const s = scale(obj, animation)
                sobj.rootElement.scale.set(s, s, s)

                const c = color(sobj, animation)
                const a = alpha(sobj, animation)
                sobj.setUniform('u_color', [ c.r, c.g, c.b, a ])
            }
            return
        default:
            throw 'Invalid state'
    }
}
