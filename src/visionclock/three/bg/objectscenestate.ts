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
import * as SnowGenerator         from './snowgenerator'
import * as C                     from '../../utils/constants'
import * as Random                from '../../utils/random'

export const create = (
    animations  : Rx.Observable<Animation.IAnimationState>,
    interactions: Rx.Observable<Interaction.IInteraction[]>,
    times       : Rx.Observable<Date>,
    random      : Random.IRandom,
    aspectObj   : RendererState.IAspect
) => {
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
        objects: new Set(),
        render(renderer) {
            render(this, renderer)
        },
        dispose() {
            if (generator) {
                generator.dispose()
            }
            subscription.unsubscribe()
            dispose(this)
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
        () => SnowGenerator.create(
            Date.now(),
            animations,
            random,
            sceneState,
            scene,
            aspectObj
        )
    ]

    let generator: Behaviour.IBehaviour
    let generatorIndex = -1

    const subscription =
        Rx.pipe(
            RxOp.map((d: Date) => d.getMinutes()),
            RxOp.distinctUntilChanged()
        )(times).subscribe(
            () => {
                R.forEach((obj: DisplayObject.IDisplayObject) => obj.state = 'fade-out')(Array.from(sceneState.objects))
                if (generator) {
                    generator.dispose()
                }

                generatorIndex = (generatorIndex + 1) % createFuncs.length
                generator      = createFuncs[generatorIndex]()
            }
        )

    return sceneState
}

const render = (
    sceneState: SceneState.ISceneState,
    renderer  : THREE.WebGLRenderer
) => {
    renderer.clearDepth()
    renderer.render(sceneState.scene, sceneState.camera)
}

const dispose = (sceneState: SceneState.ISceneState) => {
    R.forEach((obj: DisplayObject.IDisplayObject) => obj.dispose())(Array.from(sceneState.objects))
}
