import * as THREE       from 'three'
import * as R           from 'ramda'
import * as Rx          from 'rxjs'
import * as Interaction from '../interaction'
import * as ThreeObject from './threeobject'
import * as ClockObject from './clockobject'
import * as Lights      from './lights'
import * as C           from '../utils/constants'

export interface IThreeState {
    scene        : THREE.Scene
    camera       : THREE.PerspectiveCamera
    renderer     : THREE.WebGLRenderer
    render       : (threeState: IThreeState) => void
    objects      : ThreeObject.IThreeObject[]
    subscriptions: Rx.Subscription[]
}

export const create = (
    width       : number,
    height      : number,
    interactions: Rx.Observable<Interaction.IInteraction>,
    times       : Rx.Observable<Date>
): IThreeState => {
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera
    (
        30.0,
        width / height,
        0.1,
        100.0
    )
    const renderer = new THREE.WebGLRenderer()

    const threeState: IThreeState = {
        scene,
        camera,
        renderer,
        render       : threeState => threeState.renderer.render(threeState.scene, threeState.camera),
        objects      : [],
        subscriptions: [],
    }

    camera.position.set(0.0, 0.0, 5.0)
    camera.lookAt(0.0, 0.0, 0.0)

    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 0.0)
    renderer.setSize(width, height)

    const clock = ClockObject.create()
    scene.add(clock.elements.clock)
    threeState.objects.push(clock)

    const lights = Lights.create()
    scene.add(lights.elements.lights)
    threeState.objects.push(lights)

    scene.fog = new THREE.Fog(C.fogColor)

    R.forEach((obj: ThreeObject.IThreeObject) => {
        const sub = interactions.subscribe(i => obj.updateByInteraction(obj, i))
        threeState.subscriptions.push(sub)
    })(threeState.objects)

    R.forEach((obj: ThreeObject.IThreeObject) => {
        const sub = times.subscribe(d => obj.updateByTime(obj, d))
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
