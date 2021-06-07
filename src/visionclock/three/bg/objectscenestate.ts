import * as THREE                 from 'three'
import * as Rx                    from 'rxjs'
import * as RxOp                  from 'rxjs/operators'
import * as R                     from 'ramda'
import * as Animation             from '../../animation'
import * as Interaction           from '../../interaction'
import * as RendererState         from '../rendererstate'
import * as SceneState            from '../scenestate'
import * as Behaviour             from '../behaviour'
import * as DisplayObject         from '../displayobject'
import * as MovingCircleGenerator from './movingcirclegenerator'
import * as ForestGenerator       from './forestgenerator'
import * as SnowGenerator         from './snowgenerator'
import * as C                     from '../../utils/constants'
import * as Random                from '../../utils/random'

export const create = (
    animations  : Rx.Observable<Animation.IAnimationState>,
    interactions: Rx.Observable<Interaction.IInteraction>,
    times       : Rx.Observable<Date>,
    random      : Random.IRandom,
    aspectObj   : RendererState.IAspect
): SceneState.ISceneState => {
    const scene  = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
        -aspectObj.value * 0.5,
         aspectObj.value * 0.5,
         0.5,
        -0.5,
        C.orthographicParams.near,
        C.orthographicParams.far
    )

    const sceneState: SceneState.ISceneState = {
        scene,
        camera,
        behaviours: new Set(),
        objects   : new Set(),
        render(renderer) {
            render(this, renderer)
        },
        dispose() {
            R.forEach((s: Rx.Subscription) => s.unsubscribe())(subscriptions)
            SceneState.dispose(this)
        }
    }

    const createFuncs = [
        () => MovingCircleGenerator.create(
            Date.now(),
            animations,
            random,
            sceneState,
            scene,
            aspectObj
        ),
        () => ForestGenerator.create(
            Date.now(),
            animations,
            random,
            sceneState,
            scene,
            aspectObj
        ),
        () => SnowGenerator.create(
            Date.now(),
            animations,
            random,
            sceneState,
            scene,
            aspectObj
        )
    ]

    let generatorIndex = -1

    const observer = () => {
        R.forEach((obj: Behaviour    .IBehaviour    ) => obj.state = 'terminate')(Array.from(sceneState.behaviours))
        R.forEach((obj: DisplayObject.IDisplayObject) => obj.state = 'fade-out' )(Array.from(sceneState.objects))

        generatorIndex = (generatorIndex + 1) % createFuncs.length
        createFuncs[generatorIndex]()
    }

    const subscriptions = [
        Rx.pipe(
            RxOp.map((d: Date) => d.getMinutes()),
            RxOp.distinctUntilChanged()
        )(times).subscribe(observer),

        Rx.pipe(
            RxOp.map((i: Interaction.IInteraction) => i.button1),
            RxOp.distinctUntilChanged(),
            RxOp.filter(b => b)
        )(interactions).subscribe(observer)
    ]

    return sceneState
}

const render = (
    sceneState: SceneState.ISceneState,
    renderer  : THREE.WebGLRenderer
) => {
    renderer.clearDepth()
    renderer.render(sceneState.scene, sceneState.camera)
}
