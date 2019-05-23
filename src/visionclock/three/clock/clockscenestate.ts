import * as THREE         from 'three'
import * as R             from 'ramda'
import * as Rx            from 'rxjs'
import * as Animation     from '../../animation'
import * as Interaction   from '../../interaction'
import * as RendererState from '../rendererstate'
import * as SceneState    from '../scenestate'
import * as DisplayObject from '../displayobject'
import * as ClockObject   from './clockobject'
import * as Lights        from './lights'
import * as C             from '../../utils/constants'
import * as Random        from '../../utils/random'

export const create = (
    animations  : Rx.Observable<Animation.IAnimationState>,
    interactions: Rx.Observable<Interaction.IInteraction[]>,
    times       : Rx.Observable<Date>,
    random      : Random.IRandom,
    aspectObj   : RendererState.IAspect
): SceneState.ISceneState => {
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera
    (
        C.perspectiveParams.fov,
        aspectObj.value,
        C.perspectiveParams.near,
        C.perspectiveParams.far
    )

    const sceneState: SceneState.ISceneState = {
        scene,
        camera,
        objects: new Set(),
        render(renderer) {
            render(this, renderer)
        },
        dispose() {
            dispose(this)
        }
    }

    camera.position.set(0.0, 0.0, C.perspectiveParams.z)
    camera.lookAt(0.0, 0.0, 0.0)

    const now = Date.now()

    ClockObject.create(now, animations, interactions, times, sceneState, scene)
    Lights     .create(now, animations, sceneState, scene)

    scene.fog = new THREE.Fog(C.fogColor)
    
    return sceneState
}

const render = (sceneState: SceneState.ISceneState, renderer: THREE.WebGLRenderer) => {
    renderer.clearDepth()
    renderer.render(sceneState.scene, sceneState.camera)
}

const dispose = (sceneState: SceneState.ISceneState) => {
    R.forEach((obj: DisplayObject.IDisplayObject) => obj.dispose())(Array.from(sceneState.objects))
}
