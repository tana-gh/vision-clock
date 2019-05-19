import * as THREE                 from 'three'
import * as Rx                    from 'rxjs'
import * as R                     from 'ramda'
import * as Animation             from '../../animation'
import * as Interaction           from '../../interaction'
import * as SceneState            from '../scenestate'
import * as DisplayObject         from '../displayobject'
import * as MovingCircleGenerator from './movingcirclegenerator'
import * as Random                from '../../utils/random'

export const create = (
    width       : number,
    height      : number,
    animations  : Rx.Observable<Animation.IAnimationState>,
    interactions: Rx.Observable<Interaction.IInteraction[]>,
    times       : Rx.Observable<Date>,
    random      : Random.IRandom
) => {
    const aspect = width / height
    const scene  = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
        -aspect * 0.5,
         aspect * 0.5,
         0.5,
        -0.5,
        -100.0,
         100.0
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

    const now = Date.now()

    MovingCircleGenerator.create(
        now,
        animations,
        random,
        sceneState,
        scene,
        width,
        height
    )

    return sceneState
}

const render = (sceneState: SceneState.ISceneState, renderer: THREE.WebGLRenderer) => {
    renderer.render(sceneState.scene, sceneState.camera)
}

const dispose = (sceneState: SceneState.ISceneState) => {
    R.forEach((obj: DisplayObject.IDisplayObject) => obj.dispose())(Array.from(sceneState.objects))
}
