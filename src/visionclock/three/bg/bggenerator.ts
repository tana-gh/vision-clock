import * as THREE          from 'three'
import * as Rx             from 'rxjs'
import * as RxOp           from 'rxjs/operators'
import * as R              from 'ramda'
import * as Animation      from '../../animation'
import * as SceneState     from '../scenestate'
import * as Behaviour      from '../behaviour'
import * as ShaderMaterial from '../shadermaterial'
import * as DisplayObject  from '../displayobject'
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
    width     : number,
    height    : number
) => {
    const generator: Behaviour.IBehaviour = {
        timestamp,
        state: 'init',
        dispose() {
            subscription.unsubscribe()
        }
    }

    const material = ShaderMaterial.create(
        BgShader.vertexShader,
        BgShader.fragmentShader,
        {
            u_color : [0.0, 0.0, 0.0, 0.0]
        }
    )

    const subscription = animations.subscribe(
        Behaviour.updateByAnimation(
            generator, 'main', updateByAnimation(
                animations,
                random,
                sceneState,
                parent,
                material,
                width,
                height
            )
        )
    )
}

const updateByAnimation = (
    animations: Rx.Observable<Animation.IAnimationState>,
    random    : Random.IRandom,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    material  : THREE.Material,
    width     : number,
    height    : number
) => (obj: Behaviour.IBehaviour, animation: Animation.IAnimationState) => {
    switch (obj.state) {
        case 'main':
            BgObject.create(
                Date.now(),
                animations,
                sceneState,
                parent,
                material,
                width,
                height,
                (c => () => c)(new THREE.Color().setRGB(0.2, 0.1, 0.4)),
                () => 1.0
            )
            obj.state = 'terminate'
            return
        default:
            throw 'Invalid state'
    }
}
