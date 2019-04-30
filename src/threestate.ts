import * as THREE       from 'three'
import * as R           from 'ramda'
import * as Rx          from 'rxjs'
import * as Interaction from './interaction'
import * as ThreeObject from './threeobject'
import * as ClockObject from './clockobject'

export interface IThreeState {
    scene        : THREE.Scene
    camera       : THREE.Camera
    renderer     : THREE.Renderer
    objects      : ThreeObject.IThreeObject[]
    interactions : Rx.Observable<Interaction.IInteraction>
    subscriptions: Rx.Subscription[]
    width        : number
    height       : number
}

export const create = (width: number, height: number): IThreeState => {
    const renderer = new THREE.WebGLRenderer()
    const threeState = {
        scene : new THREE.Scene(),
        camera: new THREE.PerspectiveCamera
        (
            30.0,
            width / height,
            0.1,
            100.0
        ),
        renderer,
        objects      : <ThreeObject.IThreeObject[]>[],
        interactions : Interaction.create(renderer.domElement, window),
        subscriptions: <Rx.Subscription[]>[],
        width,
        height
    }

    threeState.camera.position.set(0.0, 0.0, 5.0)
    threeState.camera.lookAt(0.0, 0.0, 0.0)

    threeState.renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 0.0)
    threeState.renderer.setSize(width, height)
    
    const lightParams = [
        { color: 0xFFFFFF, x:  1.0, y:  1.0, z: 1.0 },
        { color: 0xFFCC88, x:  1.5, y:  1.5, z: 3.0 },
        { color: 0xFF44CC, x: -4.0, y: -4.0, z: 0.0 },
        { color: 0x44FF88, x:  0.0, y: -3.0, z: 1.0 },
        { color: 0x44CCFF, x:  0.0, y:  2.0, z: 0.0 }
    ]
    
    R.forEach(param => {
        const light = new THREE.PointLight(new THREE.Color(param.color))
        light.position.set(param.x, param.y, param.z)
        threeState.scene.add(light)
    }, lightParams)

    const clock = ClockObject.create()
    threeState.scene.add(clock.obj)
    threeState.objects.push(clock)

    threeState.scene.fog = new THREE.Fog(0x000000)

    R.forEach((obj: ThreeObject.IThreeObject) => {
        const sub = threeState.interactions.subscribe(i => obj.updateByInteraction(obj.obj, i))
        threeState.subscriptions.push(sub)
    })(threeState.objects)
    
    return threeState
}

export const resizeRenderer = (threeState: IThreeState, width: number, height: number) => {
    setStyle(threeState.renderer.domElement, width, height)
    setRendererSize(threeState)
}

export const dispose = (threeState: IThreeState) => {
    R.forEach((s: Rx.Subscription) => s.unsubscribe())(threeState.subscriptions)
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
    const camera = threeState.camera
    if (camera instanceof THREE.OrthographicCamera) {
        camera.left   = -width  * 0.5
        camera.right  =  width  * 0.5
        camera.top    =  height * 0.5
        camera.bottom = -height * 0.5
        camera.near   =  1.0
        camera.far    = -1.0
        camera.updateProjectionMatrix()
    }
    else if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height
        camera.updateProjectionMatrix()
    }
}
