import * as THREE       from 'three'
import * as R           from 'ramda'
import * as Rx          from 'rxjs'
import * as Interaction from './interaction'

export interface IThreeState {
    scene        : THREE.Scene
    camera       : THREE.Camera
    renderer     : THREE.Renderer
    objects      : THREE.Object3D[]
    interactions : Rx.Observable<Interaction.IInteraction>
    subscriptions: Rx.Subscription[]
    width        : number
    height       : number
}

export const create = (width: number, height: number) => {
    const threeState = {
        scene : new THREE.Scene(),
        camera: new THREE.PerspectiveCamera
        (
            30.0,
            width / height,
            0.1,
            100.0
        ),
        renderer     : new THREE.WebGLRenderer(),
        objects      : <THREE.Object3D[]>[],
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

    const geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0)
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xFFFFFF,
        metalness: 0.5,
        roughness: 0.5,
        clearCoat: 0.5,
        clearCoatRoughness: 0.5,
        reflectivity: 1.0,
        fog: true
    })
    const mesh = new THREE.Mesh(geometry, material)
    threeState.scene.add(mesh)
    threeState.objects.push(mesh)

    threeState.scene.fog = new THREE.Fog(0x000000)

    const interactions = Interaction.create(threeState.renderer.domElement, window)
    const sub = interactions.subscribe(i => {
        if (!i.button1) {
            return
        }
        const axis = i.movement
                      .clone()
                      .cross(new THREE.Vector3(0.0, 0.0, -1.0))
                      .normalize()
        R.forEach(obj => obj.rotateOnWorldAxis(axis, i.movement.length()), threeState.objects)
    })
    threeState.subscriptions.push(sub)

    return {
        ...threeState,
        interactions
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
