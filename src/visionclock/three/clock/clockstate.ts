import * as THREE         from 'three'
import * as R             from 'ramda'
import * as Rx            from 'rxjs'
import * as Animation     from '../../animation'
import * as Interaction   from '../../interaction'
import * as SceneState    from '../scenestate'
import * as DisplayObject from '../displayobject'
import * as ClockObject   from './clockobject'
import * as Lights        from './lights'
import * as C             from '../../utils/constants'
import * as Random        from '../../utils/random'

export const create = (
    width       : number,
    height      : number,
    animations  : Rx.Observable<Animation.IAnimationState>,
    interactions: Rx.Observable<Interaction.IInteraction[]>,
    times       : Rx.Observable<Date>,
    random      : Random.IRandom
): SceneState.ISceneState => {
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera
    (
        C.perspectiveParams.fov,
        width / height,
        C.perspectiveParams.near,
        C.perspectiveParams.far
    )

    const sceneState: SceneState.ISceneState = {
        scene,
        camera,
        objects: new Set()
    }

    camera.position.set(0.0, 0.0, C.perspectiveParams.z)
    camera.lookAt(0.0, 0.0, 0.0)

    const clock = ClockObject.create(sceneState, scene, Date.now())
    scene.add(clock.elements.clock)
    sceneState.objects.add(clock)

    const lights = Lights.create(sceneState, scene, Date.now())
    scene.add(lights.elements.lights)
    sceneState.objects.add(lights)

    scene.fog = new THREE.Fog(C.fogColor)

    const subscriptions = [
        animations.subscribe(a =>
            R.pipe(
                R.map((obj: DisplayObject.IDisplayObject) => obj.updateByAnimation!),
                R.juxt
            )([...sceneState.objects])(a)
        ),

        interactions.subscribe(ii =>
            R.forEach(
                R.pipe(
                    R.map((obj: DisplayObject.IDisplayObject) => obj.updateByInteraction!),
                    R.juxt
                )([...sceneState.objects])
            )(ii)
        ),
        
        times.subscribe(t =>
            R.pipe(
                R.map((obj: DisplayObject.IDisplayObject) => obj.updateByTime!),
                R.juxt
            )([...sceneState.objects])(t)
        )
    ]

    sceneState.render  = render (sceneState)
    sceneState.dispose = dispose(sceneState, subscriptions)
    
    return sceneState
}

const render = (sceneState: SceneState.ISceneState) => (renderer: THREE.WebGLRenderer) => {
    renderer.clearDepth()
    renderer.render(sceneState.scene, sceneState.camera)
}

const dispose = (sceneState: SceneState.ISceneState, subscriptions: Rx.Subscription[]) => () => {
    R.forEach((obj: DisplayObject.IDisplayObject) => obj.dispose!())([...sceneState.objects])
    R.forEach((s: Rx.Subscription) => s.unsubscribe())(subscriptions)
}
