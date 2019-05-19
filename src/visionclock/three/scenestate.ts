import * as THREE         from 'three'
import * as DisplayObject from './displayobject'

export interface ISceneState {
    scene  : THREE.Scene
    camera : THREE.Camera
    objects: Set<DisplayObject.IDisplayObject>
    render : (renderer: THREE.WebGLRenderer) => void
    dispose: () => void
}

export const setCameraSize = (camera: THREE.Camera, width: number, height: number) => {
    const aspect = width / height
    if (camera instanceof THREE.OrthographicCamera) {
        camera.left   = -aspect * 0.5
        camera.right  =  aspect * 0.5
        camera.top    =  0.5
        camera.bottom = -0.5
        camera.near   =  1.0
        camera.far    = -1.0
        camera.updateProjectionMatrix()
    }
    else if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = aspect
        camera.updateProjectionMatrix()
    }
}
