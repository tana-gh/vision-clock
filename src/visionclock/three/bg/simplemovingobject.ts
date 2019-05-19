import * as THREE         from 'three'
import * as Rx            from 'rxjs'
import * as Animation     from '../../animation'
import * as SceneState    from '../scenestate'
import * as DisplayObject from '../displayobject'
import * as ShaderObject  from './shaderobject'

export const create = (
    timestamp : number,
    animations: Rx.Observable<Animation.IAnimationState>,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    position  : THREE.Vector3,
    radius    : number,
    material  : THREE.Material,
    velocity  : THREE.Vector3,
    color     : THREE.Color,
    alpha     : number,
    isAlive   : (position: THREE.Vector3) => boolean
) => {
    return ShaderObject.create(
        timestamp,
        animations,
        'main',
        updateByAnimation(sceneState, velocity, color, alpha, isAlive),
        sceneState,
        parent,
        position,
        radius * 2.0,
        radius * 2.0,
        {
            a_coord: [
                -1.0, -1.0, 0.0, 1.0,
                 1.0, -1.0, 0.0, 1.0,
                 1.0,  1.0, 0.0, 1.0,
                -1.0,  1.0, 0.0, 1.0
            ]
        },
        {
            a_coord: 4
        },
        material
    )
}

const updateByAnimation = (
    sceneState: SceneState.ISceneState,
    velocity  : THREE.Vector3,
    color     : THREE.Color,
    alpha     : number,
    isAlive   : (position: THREE.Vector3) => boolean
) => (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => {
    const sobj = <ShaderObject.IShaderObject>obj
    
    switch (sobj.state) {
        case 'main':
            {
                sobj.elements.rectangle.position.add(velocity.clone().multiplyScalar(animation.progress))
                if (!isAlive(sobj.elements.rectangle.position)) {
                    sobj.state = 'terminate'
                    return
                }

                const time = DisplayObject.getTime(obj, animation)
                const c    = color.clone()
                const hsl  = c.getHSL({ h: 0.0, s: 0.0, l: 0.0 })
                c.setHSL(
                    hsl.h,
                    hsl.s * (Math.sin(0.003  * Math.PI * time) * 0.2 + 0.8),
                    hsl.l * (Math.sin(0.0025 * Math.PI * time) * 0.3 + 0.3)
                )

                sobj.setUniform('u_color', [ c.r, c.g, c.b, alpha ])
            }
            return
        default:
            throw 'Invalid state'
    }
}
