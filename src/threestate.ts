import * as THREE       from 'three'
import * as R           from 'ramda'
import * as Rx          from 'rxjs'
import * as Interaction from './interaction'

export interface IThreeState {
    scene        : THREE.Scene
    camera       : THREE.OrthographicCamera
    renderer     : THREE.WebGLRenderer
    mesh         : THREE.Mesh               | undefined
    interaction  : Interaction.IInteraction | undefined
    subscriptions: Rx.Subscription[]
    width        : number
    height       : number
}

export const create = (width: number, height: number) => {
    const threeState = {
        scene : new THREE.Scene(),
        camera: new THREE.OrthographicCamera
        (
            -width  * 0.5,
             width  * 0.5,
             height * 0.5,
            -height * 0.5,
             200.0,
            -200.0
        ),
        renderer     : new THREE.WebGLRenderer(),
        subscriptions: <Rx.Subscription[]>[],
        width,
        height
    }

    threeState.renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 0.0)
    threeState.renderer.setSize(width, height)
    
    const geometry = new THREE.BoxGeometry(50.0, 50.0, 50.0)
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    const mesh     = new THREE.Mesh(geometry, material)
    threeState.scene.add(mesh)

    return {
        ...threeState,
        mesh       : undefined,
        interaction: undefined
    }
}

export const resizeRenderer = (threeState: IThreeState, width: number, height: number) => {
    setStyle(threeState.renderer.domElement, width, height)
    setRendererSize(threeState)
}

export const dispose = (threeState: IThreeState) => {
    threeState.subscriptions.forEach(s => s.unsubscribe())
}

const setStyle = (element: HTMLElement, width: number, height: number) => {
    element.style.width  = `${width}px`
    element.style.height = `${height}px`
}

const setRendererSize = (threeState: IThreeState) => {
    const canvas = threeState.renderer.domElement
    const w = canvas.clientWidth
    const h = canvas.clientHeight

    if (w != canvas.width || h != canvas.height) {
        threeState.renderer.setSize(w, h)
        setCameraSize(threeState, w, h)
    }
}

const setCameraSize = (threeState: IThreeState, width: number, height: number) => {
    threeState.camera.left   = -width  * 0.5
    threeState.camera.right  =  width  * 0.5
    threeState.camera.top    =  height * 0.5
    threeState.camera.bottom = -height * 0.5
    threeState.camera.near   =  1.0
    threeState.camera.far    = -1.0
    threeState.camera.updateProjectionMatrix()
}
