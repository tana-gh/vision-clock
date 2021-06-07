import * as THREE          from 'three'
import * as Rx             from 'rxjs'
import * as RxOp           from 'rxjs/operators'
import * as Animation      from '../../animation'
import * as RendererState  from '../rendererstate'
import * as SceneState     from '../scenestate'
import * as Behaviour      from '../behaviour'
import * as ShaderMaterial from '../shadermaterial'
import * as DisplayObject  from '../displayobject'
import * as MovingObject   from './movingobject'
import * as CircleShader   from './circleshader'
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
            subscription.unsubscribe()
            material.dispose()
        }
    }
    sceneState.behaviours.add(generator)

    const material = ShaderMaterial.create(
        CircleShader.vertexShader,
        CircleShader.fragmentShader,
        {
            u_rinner: C.snowGeneratorParams.u_rinner,
            u_router: C.snowGeneratorParams.u_router,
            u_color : [0.0, 0.0, 0.0, 0.0]
        }
    )

    const store = {}

    const subscription = Rx.pipe(
        RxOp.map((a: Animation.IAnimationState) =>
            <[Animation.IAnimationState, number]>
            [a, Math.floor(a.total * C.framePerMillisecond * C.snowGeneratorParams.createFreq)]),
        RxOp.distinctUntilChanged((x, y) => x[1] == y[1]),
        RxOp.map(z => z[0])
    )(animations)
    .subscribe(
        Behaviour.updateByAnimation(
            generator, sceneState, 'main', store, updateByAnimation(
                animations,
                random,
                sceneState,
                parent,
                material,
                aspectObj
            )
        )
    )

    return generator
}

const updateByAnimation = (
    animations: Rx.Observable<Animation.IAnimationState>,
    random    : Random.IRandom,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    material  : THREE.Material,
    aspectObj : RendererState.IAspect
) => (obj: Behaviour.IBehaviour, animation: Animation.IAnimationState, store: any) => {
    switch (obj.state) {
        case 'main':
            MovingObject.create(
                Date.now(),
                animations,
                sceneState,
                parent,
                material.clone(),
                new THREE.Vector3(
                    (random.next() - 0.5) * aspectObj.value,
                    0.5 + C.snowGeneratorParams.maxRadius * 2.0,
                    0.0
                ),
                ((v, amp, ph) => (o: DisplayObject.IDisplayObject, a: Animation.IAnimationState) =>
                    new THREE.Vector3(
                        Math.sin(
                            2.0 * Math.PI * (C.snowGeneratorParams.yAngular *
                            (DisplayObject.getTime(o, a) * 0.001) + ph)) *
                            (amp * (C.snowGeneratorParams.xMaxSpeed  -
                                    C.snowGeneratorParams.xMinSpeed) +
                                    C.snowGeneratorParams.xMinSpeed),
                        -(v * (C.snowGeneratorParams.yMaxSpeed  -
                               C.snowGeneratorParams.yMinSpeed) +
                               C.snowGeneratorParams.yMinSpeed),
                        0.0
                    ).multiplyScalar(a.progress))(random.next(), random.next(), random.next()),
                (r => () => r)(
                    Math.pow(random.next(), C.snowGeneratorParams.radiusPow) * 
                        (C.snowGeneratorParams.maxRadius  -
                         C.snowGeneratorParams.minRadius) +
                         C.snowGeneratorParams.minRadius),
                (c => () => c)(new THREE.Color().setRGB(1.0, 1.0, 1.0).multiplyScalar(C.snowGeneratorParams.lightness)),
                () => 1.0,
                (o, a) => {
                    return o.rootElement.position.y > -(0.5 + C.snowGeneratorParams.maxRadius * 2.0)
                }
            )
            return
        default:
            throw 'Invalid state'
    }
}
