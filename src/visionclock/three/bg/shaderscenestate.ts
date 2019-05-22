import * as THREE         from 'three'
import * as R             from 'ramda'
import * as SceneState    from '../scenestate'
import * as DisplayObject from '../displayobject'

export const create = (
    width     : number,
    height    : number,
    createFunc: (sceneState: SceneState.ISceneState, parent: THREE.Object3D) => void,
    clearDepth: boolean
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
