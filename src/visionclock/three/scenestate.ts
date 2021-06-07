import * as THREE         from 'three'
import * as R             from 'ramda'
import * as Behaviour     from './behaviour'
import * as DisplayObject from './displayobject'
import * as C             from '../utils/constants'

export interface ISceneState {
    scene     : THREE.Scene
    camera    : THREE.Camera
    behaviours: Set<Behaviour.IBehaviour>
    objects   : Set<DisplayObject.IDisplayObject>
    render    : (renderer: THREE.WebGLRenderer) => void
    dispose   : () => void
}

export const setCameraSize = (camera: THREE.Camera, aspect: number): void => {
    if (camera instanceof THREE.OrthographicCamera) {
        camera.left   = -aspect * 0.5
        camera.right  =  aspect * 0.5
        camera.top    =  0.5
        camera.bottom = -0.5
        camera.near   = C.orthographicParams.near
        camera.far    = C.orthographicParams.far
        camera.updateProjectionMatrix()
    }
    else if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = aspect
        camera.updateProjectionMatrix()
    }
}

export const dispose = (sceneState: ISceneState): void => {
    R.forEach((obj: Behaviour    .IBehaviour    ) => obj.dispose())(Array.from(sceneState.behaviours))
    R.forEach((obj: DisplayObject.IDisplayObject) => obj.dispose())(Array.from(sceneState.objects))
}
