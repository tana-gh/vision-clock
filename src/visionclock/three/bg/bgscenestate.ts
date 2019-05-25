import * as THREE            from 'three'
import * as Rx               from 'rxjs'
import * as R                from 'ramda'
import * as Animation        from '../../animation'
import * as Interaction      from '../../interaction'
import * as RendererState    from '../rendererstate'
import * as SceneState       from '../scenestate'
import * as DisplayObject    from '../displayobject'
import * as BgGenerator      from './bggenerator'
import * as C                from '../../utils/constants'
import * as Random           from '../../utils/random'

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
            dispose(this)
        }
    }

    BgGenerator.create(
        Date.now(),
        animations,
        random,
        sceneState,
        scene,
        aspectObj
    )

    return sceneState
}

const render = (
    sceneState: SceneState.ISceneState,
    renderer  : THREE.WebGLRenderer
) => {
    renderer.render(sceneState.scene, sceneState.camera)
}

const dispose = (sceneState: SceneState.ISceneState) => {
    R.forEach((obj: DisplayObject.IDisplayObject) => obj.dispose())(Array.from(sceneState.objects))
}
