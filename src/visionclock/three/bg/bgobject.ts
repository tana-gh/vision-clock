import * as THREE         from 'three'
import * as Rx            from 'rxjs'
import * as Animation     from '../../animation'
import * as RendererState from '../rendererstate'
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
    aspectObj : RendererState.IAspect,
    color     : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => THREE.Color,
    alpha     : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => number,
): ShaderObject.IShaderObject => {
    return ShaderObject.create(
        timestamp,
        animations,
        'main',
        updateByAnimation(aspectObj, color, alpha),
        sceneState,
        parent,
        new THREE.Vector3(0.0, 0.0, 0.0),
        aspectObj.value,
        1.0,
        {
            a_coord: [
                -aspectObj.value, -1.0, 0.0, 1.0,
                 aspectObj.value, -1.0, 0.0, 1.0,
                 aspectObj.value,  1.0, 0.0, 1.0,
                -aspectObj.value,  1.0, 0.0, 1.0
            ]
        },
        {
            a_coord: 4
        },
        material
    )
}

const updateByAnimation = (
    aspectObj: RendererState.IAspect,
    color    : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => THREE.Color,
    alpha    : (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState) => number
) => (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState, store: any) => {
    const sobj = <ShaderObject.IShaderObject>obj
    
    switch (sobj.state) {
        case 'main':
            {
                sobj.setUniform('u_aspect', aspectObj.value)

                const c = color(sobj, animation)
                const a = alpha(sobj, animation)

                const bgColor = c.clone().multiplyScalar(C.bgObjectParams.bgLightness)
                sobj.setUniform('u_bgcolor' , [ bgColor.r, bgColor.g, bgColor.b, a ])

                const arcColor = c.clone()
                const hsl      = arcColor.getHSL({ h: 0.0, s: 0.0, l: 0.0 })
                arcColor.setHSL(hsl.h + C.bgObjectParams.arcHue, hsl.s, hsl.l)
                sobj.setUniform('u_arccolor', [ arcColor.r, arcColor.g, arcColor.b, a ])
            }
            return
        default:
            throw 'Invalid state'
    }
}
