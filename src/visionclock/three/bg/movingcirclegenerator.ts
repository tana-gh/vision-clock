import * as THREE              from 'three'
import * as Rx                 from 'rxjs'
import * as RxOp               from 'rxjs/operators'
import * as R                  from 'ramda'
import * as Animation          from '../../animation'
import * as SceneState         from '../scenestate'
import * as Behaviour          from '../behaviour'
import * as ShaderMaterial     from '../shadermaterial'
import * as SimpleMovingObject from './simplemovingobject'
import * as Shader             from './circleobjectshader'
import * as Random             from '../../utils/random'

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

    const material = ShaderMaterial.create(Shader.vertexShader, Shader.fragmentShader, {
        u_rinner: 0.8,
        u_router: 1.0,
        u_color : [0.0, 0.0, 0.0, 0.0]
    })

    const subscription = Rx.pipe(
            RxOp.map((a: Animation.IAnimationState) =>
                <[Animation.IAnimationState, number]>[a, Math.floor(a.total / 60.0)]),
            RxOp.distinctUntilChanged((x, y) => x[1] == y[1]),
            RxOp.map(z => z[0])
        )(animations)
        .subscribe(
            Behaviour.updateByAnimation(generator, 'main', updateByAnimation(
                animations,
                random,
                sceneState,
                parent,
                width,
                height,
                material
            )
        )
    )
}

const updateByAnimation = (
    animations: Rx.Observable<Animation.IAnimationState>,
    random    : Random.IRandom,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    width     : number,
    height    : number,
    material  : THREE.Material
) => (obj: Behaviour.IBehaviour, animation: Animation.IAnimationState) => {
    switch (obj.state) {
        case 'main':
            R.forEach(_ => {
                SimpleMovingObject.create(
                    Date.now(),
                    animations,
                    sceneState,
                    parent,
                    new THREE.Vector3(
                        -width / height * 0.8,
                        random.next() - 0.5,
                        0.0
                    ),
                    random.next() * 0.15 + 0.05,
                    material.clone(),
                    new THREE.Vector3(
                        (random.next() + 0.5) * 0.002,
                        0.0,
                        0.0
                    ),
                    new THREE.Color().setHSL(random.next(), 1.0, 0.99),
                    1.0,
                    pos => pos.x < width / height * 0.8
                )
            })(R.range(1, 3))
            return
        default:
            throw 'Invalid state'
    }
}
