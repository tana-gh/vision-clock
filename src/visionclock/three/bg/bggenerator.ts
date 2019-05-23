import * as THREE          from 'three'
import * as Rx             from 'rxjs'
import * as R              from 'ramda'
import * as Animation      from '../../animation'
import * as RendererState  from '../rendererstate'
import * as SceneState     from '../scenestate'
import * as Behaviour      from '../behaviour'
import * as ShaderMaterial from '../shadermaterial'
import * as ShaderObject   from './shaderobject'
import * as BgObject       from './bgobject'
import * as BgShader       from './bgshader'
import * as Random         from '../../utils/random'

export const create = (
    timestamp : number,
    animations: Rx.Observable<Animation.IAnimationState>,
    random    : Random.IRandom,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    aspectObj : RendererState.IAspect
) => {
    const generator: Behaviour.IBehaviour = {
        timestamp,
        state: 'init',
        dispose() {
            R.forEach((s: Rx.Subscription) => s.unsubscribe())(subscriptions)
        }
    }

    const material = ShaderMaterial.create(
        BgShader.vertexShader,
        BgShader.fragmentShader,
        {
            u_color : [0.0, 0.0, 0.0, 0.0]
        }
    )

    let bgObj: ShaderObject.IShaderObject | undefined
    const subscriptions = [
        aspectObj.observable.subscribe(
            () => {
                if (bgObj) {
                    bgObj.state = 'terminate'
                }

                bgObj = BgObject.create(
                    Date.now(),
                    animations,
                    sceneState,
                    parent,
                    material,
                    aspectObj,
                    (c => () => c)(new THREE.Color().setRGB(0.2, 0.1, 0.4)),
                    () => 1.0
                )
            }
        ),

        animations.subscribe(
            Behaviour.updateByAnimation(
                generator, 'main', updateByAnimation(
                    animations,
                    random,
                    sceneState,
                    parent,
                    material,
                    aspectObj
                )
            )
        )
    ]
}

const updateByAnimation = (
    animations: Rx.Observable<Animation.IAnimationState>,
    random    : Random.IRandom,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    material  : THREE.Material,
    aspectObj : RendererState.IAspect
) => (obj: Behaviour.IBehaviour, animation: Animation.IAnimationState) => {
    switch (obj.state) {
        case 'main':
            return
        default:
            throw 'Invalid state'
    }
}
