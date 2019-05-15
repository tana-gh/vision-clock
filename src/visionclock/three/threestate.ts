import * as THREE       from 'three'
import * as R           from 'ramda'
import * as Rx          from 'rxjs'
import * as Animation   from '../animation'
import * as Interaction from '../interaction'
import * as ThreeObject from './threeobject'
import * as ClockObject from './clockobject'
import * as Lights      from './lights'
import * as C           from '../utils/constants'
import * as Random      from '../utils/random'

export interface IThreeState {
    scene       : THREE.Scene
    camera      : THREE.PerspectiveCamera
    pixiScene   : THREE.Scene
    pixiCamera  : THREE.OrthographicCamera
    pixiMaterial: THREE.SpriteMaterial
    renderer    : THREE.WebGLRenderer
    objects     : Set<ThreeObject.IThreeObject>
    render?     : (
        animationState: Animation.IAnimationState,
        pixiTexture   : Uint8Array | Uint8ClampedArray
    ) => void
    dispose?: () => void
}

export const create = (
    width       : number,
    height      : number,
    animations  : Rx.Observable<Animation.IAnimationState>,
    interactions: Rx.Observable<Interaction.IInteraction[]>,
    times       : Rx.Observable<Date>,
    random      : Random.IRandom
): IThreeState => {
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera
    (
        30.0,
        width / height,
        0.1,
        100.0
    )
    const pixiScene    = new THREE.Scene
    const pixiCamera   = new THREE.OrthographicCamera(
        -0.5,
         0.5,
         0.5,
        -0.5,
         0.5,
        -0.5
    )
    const pixiMaterial = new THREE.SpriteMaterial()
    const renderer     = new THREE.WebGLRenderer()

    const threeState: IThreeState = {
        scene,
        camera,
        pixiScene,
        pixiCamera,
        pixiMaterial,
        renderer,
        objects: new Set()
    }

    camera.position.set(0.0, 0.0, 5.0)
    camera.lookAt(0.0, 0.0, 0.0)

    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 0.0)
    renderer.setSize(width, height)
    renderer.autoClear = false

    pixiMaterial.needsUpdate = true
    const pixiSprite = new THREE.Sprite(pixiMaterial)
    pixiScene.add(pixiSprite)

    const clock = ClockObject.create(threeState, scene, Date.now())
    scene.add(clock.elements.clock)
    threeState.objects.add(clock)

    const lights = Lights.create(threeState, scene, Date.now())
    scene.add(lights.elements.lights)
    threeState.objects.add(lights)

    scene.fog = new THREE.Fog(C.fogColor)

    const subscriptions = [
        animations.subscribe(a =>
            R.pipe(
                R.map((obj: ThreeObject.IThreeObject) => obj.updateByAnimation!),
                R.juxt
            )([...threeState.objects])(a)
        ),

        interactions.subscribe(ii =>
            R.forEach(
                R.pipe(
                    R.map((obj: ThreeObject.IThreeObject) => obj.updateByInteraction!),
                    R.juxt
                )([...threeState.objects])
            )(ii)
        ),
        
        times.subscribe(t =>
            R.pipe(
                R.map((obj: ThreeObject.IThreeObject) => obj.updateByTime!),
                R.juxt
            )([...threeState.objects])(t)
        )
    ]

    threeState.render = render(threeState, width, height)

    threeState.dispose = () => {
        threeState.renderer.dispose()
        R.forEach((obj: ThreeObject.IThreeObject) => obj.dispose!())([...threeState.objects])
        R.forEach((s: Rx.Subscription) => s.unsubscribe())(subscriptions)
    }
    
    return threeState
}

export const resizeRenderer = (threeState: IThreeState, width: number, height: number) => {
    setStyle(threeState.renderer.domElement, width, height)
    setRendererSize(threeState)
    threeState.render = render(threeState, width, height)
}

const setStyle = (element: HTMLElement, width: number, height: number) => {
    element.style.width  = `${width }px`
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

const render = (threeState: IThreeState, width: number, height: number) =>
(animationState: Animation.IAnimationState, rawPixiTexture: Uint8Array | Uint8ClampedArray) => {
    const pixiTexture = new THREE.DataTexture(rawPixiTexture, width, height, THREE.RGBAFormat)
    pixiTexture.needsUpdate = true
    threeState.pixiMaterial.map = pixiTexture

    threeState.renderer.clear()
    threeState.renderer.render(threeState.pixiScene, threeState.pixiCamera)
    threeState.renderer.clearDepth()
    threeState.renderer.render(threeState.scene    , threeState.camera)
}
