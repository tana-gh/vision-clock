import * as THREE          from 'three'
import * as Rx             from 'rxjs'
import * as RxOp           from 'rxjs/operators'
import * as R              from 'ramda'
import * as Animation      from '../../animation'
import * as RendererState  from '../rendererstate'
import * as SceneState     from '../scenestate'
import * as Behaviour      from '../behaviour'
import * as DisplayObject  from '../displayobject'
import * as ShaderMaterial from '../shadermaterial'
import * as TreeGenerator  from './treegenerator'
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
) => {
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
            u_rinner: C.forestGeneratorParams.u_rinner,
            u_router: C.forestGeneratorParams.u_router,
            u_color : [0.0, 0.0, 0.0, 0.0]
        }
    )

    const store = {}

    const subscription = Rx.pipe(
        RxOp.map((a: Animation.IAnimationState) =>
            <[Animation.IAnimationState, number]>
            [a, Math.floor(a.total * C.framePerMillisecond * C.treeGeneratorParams.createFreq)]),
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
            if (store.beginTime === undefined) {
                store.beginTime = Number.NEGATIVE_INFINITY
            }

            const time = Behaviour.getTime(obj, animation)

            if (time > store.beginTime + C.forestGeneratorParams.interval) {
                R.forEach((o: DisplayObject.IDisplayObject) => o.state = 'fade-out')(Array.from(sceneState.objects))

                TreeGenerator.create(
                    Date.now(),
                    animations,
                    random,
                    sceneState,
                    parent,
                    material.clone(),
                    new THREE.Vector3((random.next() - 0.5) * aspectObj.value, -0.5,  0.0),
                    new THREE.Vector3(0.0,  1.0,  0.0).multiplyScalar(C.forestGeneratorParams.velocity),
                    new THREE.Vector3(1.0,  0.0,  0.0),
                    new THREE.Vector3(0.0,  0.0, -1.0),
                    C.forestGeneratorParams.objCount,
                    C.forestGeneratorParams.depth
                )

                store.beginTime = time
            }
            return
        default:
            throw 'Invalid state'
    }
}
