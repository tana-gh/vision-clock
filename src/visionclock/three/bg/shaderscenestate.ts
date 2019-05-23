import * as THREE         from 'three'
import * as R             from 'ramda'
import * as RendererState from '../rendererstate'
import * as SceneState    from '../scenestate'
import * as DisplayObject from '../displayobject'
import * as C             from '../../utils/constants'

export const create = (
    aspectObj : RendererState.IAspect,
    createFunc: (sceneState: SceneState.ISceneState, parent: THREE.Object3D) => void,
    clearDepth: boolean
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
            render(this, renderer, clearDepth)
        },
        dispose() {
            dispose(this)
        }
    }

    createFunc(sceneState, scene)

    return sceneState
}

const render = (
    sceneState: SceneState.ISceneState,
    renderer  : THREE.WebGLRenderer,
    clearDepth: boolean
) => {
    if (clearDepth) {
        renderer.clearDepth()
    }
    renderer.render(sceneState.scene, sceneState.camera)
}

const dispose = (sceneState: SceneState.ISceneState) => {
    R.forEach((obj: DisplayObject.IDisplayObject) => obj.dispose())(Array.from(sceneState.objects))
}
