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
        'fade-in',
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
) => (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState, store: any) => {
    const sobj = <ShaderObject.IShaderObject>obj
    
    switch (obj.state) {
        case 'fade-in':
            {
                const time      = DisplayObject.getTime(obj, animation)
                const timeRatio = time / C.movingObjectParams.fadeInTime

                obj.rootElement.position.add(velocity(obj, animation))
                if (!isAlive(obj, animation)) {
                    obj.state = 'terminate'
                    return
                }

                const s = scale(obj, animation)
                obj.rootElement.scale.set(s, s, s)

                const c = color(obj, animation).clone().multiplyScalar(timeRatio)
                const a = alpha(obj, animation)
                sobj.setUniform('u_color', [ c.r, c.g, c.b, a ])

                if (time > C.movingObjectParams.fadeInTime) {
                    obj.state = 'main'
                }
            }
            return
        case 'main':
            {
                obj.rootElement.position.add(velocity(obj, animation))
                if (!isAlive(obj, animation)) {
                    obj.state = 'terminate'
                    return
                }

                const s = scale(obj, animation)
                obj.rootElement.scale.set(s, s, s)

                const c = color(obj, animation)
                const a = alpha(obj, animation)
                sobj.setUniform('u_color', [ c.r, c.g, c.b, a ])
            }
            return
        case 'fade-out':
            {
                if (store.beginTime === undefined) {
                    store.beginTime = DisplayObject.getTime(obj, animation)
                }

                const time      = DisplayObject.getTime(obj, animation) - store.beginTime
                const timeRatio = 1.0 - time / C.movingObjectParams.fadeOutTime

                obj.rootElement.position.add(velocity(obj, animation))
                if (!isAlive(obj, animation)) {
                    obj.state = 'terminate'
                    return
                }

                const s = scale(obj, animation)
                obj.rootElement.scale.set(s, s, s)

                const c = color(obj, animation).clone().multiplyScalar(timeRatio)
                const a = alpha(obj, animation)
                sobj.setUniform('u_color', [ c.r, c.g, c.b, a ])

                if (time > C.movingObjectParams.fadeOutTime) {
                    obj.state = 'terminate'
                }
            }
            return
        default:
            throw 'Invalid state'
    }
}
