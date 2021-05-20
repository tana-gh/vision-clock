import * as THREE          from 'three'
import * as Rx             from 'rxjs'
import * as R              from 'ramda'
import * as Animation      from '../../animation'
import * as RendererState  from '../rendererstate'
import * as SceneState     from '../scenestate'
import * as Behaviour      from '../behaviour'
import * as DisplayObject  from '../displayobject'
import * as ShaderMaterial from '../shadermaterial'
import * as ShaderObject   from './shaderobject'
import * as BgObject       from './bgobject'
import * as BgShader       from './bgshader'
import * as C              from '../../utils/constants'
import * as Random         from '../../utils/random'

export const create = (
    timestamp : number,
    animations: Rx.Observable<Animation.IAnimationState>,
    random    : Random.IRandom,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    aspectObj : RendererState.IAspect
): Behaviour.IBehaviour => {
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
            u_aspect  : 0.0,
            u_radius  : C.bgGeneratorParams.u_radius,
            u_arcy    : C.bgGeneratorParams.u_arcy,
            u_powinner: C.bgGeneratorParams.u_powinner,
            u_powouter: C.bgGeneratorParams.u_powouter,
            u_bgcolor : [0.0, 0.0, 0.0, 0.0],
            u_arccolor: [0.0, 0.0, 0.0, 0.0],
            u_white   : C.bgGeneratorParams.u_white
        }
    )

    let bgObj: ShaderObject.IShaderObject | undefined
    const store = {}
    const color1 = new THREE.Color(random.next(), random.next(), random.next())
    const color2 = new THREE.Color(random.next(), random.next(), random.next())

    const subscriptions = [
        aspectObj.observable.subscribe(
            () => {
                if (bgObj) {
                    bgObj.state = 'terminate'
                }

                let prevTime = 0.0

                bgObj = BgObject.create(
                    Date.now(),
                    animations,
                    sceneState,
                    parent,
                    material,
                    aspectObj,
                    (o, a) => {
                        const time =
                            a.total %
                            C.bgGeneratorParams.colorFreq /
                            C.bgGeneratorParams.colorFreq
                        if (time < prevTime) {
                            color1.set(color2)
                            color2.setRGB(random.next(), random.next(), random.next())
                        }
                        prevTime = time
                        return color1.clone().lerpHSL(color2, time)
                    },
                    () => 1.0
                )
            }
        ),

        animations.subscribe(
            Behaviour.updateByAnimation(generator, sceneState, 'main', store, updateByAnimation)
        )
    ]

    return generator
}

const updateByAnimation = (obj: Behaviour.IBehaviour, animation: Animation.IAnimationState, store: any) => {
    switch (obj.state) {
        case 'main':
            return
        default:
            throw 'Invalid state'
    }
}
