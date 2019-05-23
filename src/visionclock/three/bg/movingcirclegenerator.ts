import * as THREE          from 'three'
import * as Rx             from 'rxjs'
import * as RxOp           from 'rxjs/operators'
import * as R              from 'ramda'
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
) => {
    const generator: Behaviour.IBehaviour = {
        timestamp,
        state: 'init',
        dispose() {
            subscription.unsubscribe()
        }
    }

    const material = ShaderMaterial.create(
        CircleShader.vertexShader,
        CircleShader.fragmentShader,
        {
            u_rinner: C.movingCircleGeneratorParams.u_rinner,
            u_router: C.movingCircleGeneratorParams.u_router,
            u_color : [0.0, 0.0, 0.0, 0.0]
        }
    )

    const subscription = Rx.pipe(
        RxOp.map((a: Animation.IAnimationState) =>
            <[Animation.IAnimationState, number]>[a, Math.floor(a.total * C.framePerMillisecond)]),
        RxOp.distinctUntilChanged((x, y) => x[1] == y[1]),
        RxOp.map(z => z[0])
    )(animations)
    .subscribe(
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
            R.forEach(_ => {
                MovingObject.create(
                    Date.now(),
                    animations,
                    sceneState,
                    parent,
                    material.clone(),
                    new THREE.Vector3(
                        -aspectObj.value * C.movingCircleGeneratorParams.limitWidth,
                        random.next() - 0.5,
                        0.0
                    ),
                    (v => (o, a) => v.clone().multiplyScalar(a.progress))(
                        new THREE.Vector3(
                            random.next() *
                                (C.movingCircleGeneratorParams.maxSpeed  -
                                 C.movingCircleGeneratorParams.minSpeed) +
                                 C.movingCircleGeneratorParams.minSpeed,
                            0.0,
                            0.0
                        )
                    ),
                    (r => () => r)(
                        random.next() * 
                            (C.movingCircleGeneratorParams.maxRadius  -
                             C.movingCircleGeneratorParams.minRadius) +
                             C.movingCircleGeneratorParams.minRadius),
                    (color => (o, a) => {
                        const time = DisplayObject.getTime(o, a)
                        const c    = color.clone()
                        const hsl  = c.getHSL({ h: 0.0, s: 0.0, l: 0.0 })
                        c.setHSL(
                            hsl.h,
                            hsl.s *
                                (Math.sin(C.movingCircleGeneratorParams.sAngular * time * 2.0 * Math.PI) *
                                C.movingCircleGeneratorParams.sAmp + C.movingCircleGeneratorParams.sScalar),
                            hsl.l *
                                (Math.sin(C.movingCircleGeneratorParams.lAngular * time * 2.0 * Math.PI) *
                                C.movingCircleGeneratorParams.lAmp + C.movingCircleGeneratorParams.lScalar)
                        )
                        return c
                    })(new THREE.Color().setHSL(random.next(), 1.0, 0.99)),
                    () => 1.0,
                    (o, a) => {
                        return o.rootElement.position.x < aspectObj.value * C.movingCircleGeneratorParams.limitWidth
                    }
                )
            })(R.range(1, 3))
            return
        default:
            throw 'Invalid state'
    }
}
