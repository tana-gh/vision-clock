import * as THREE    from 'three'
import * as R        from 'ramda'
import * as Interact from './interact'
import * as Object3D from './object3d'

const modelCount = 500
const lightCount = 10

export interface IThree {
    readonly scene    : THREE.Scene
    readonly camera   : THREE.Camera
    readonly renderer : THREE.Renderer
}

export interface IState {
    interact: Interact.IInteract | undefined
    start   : number | undefined
    before  : number | undefined
    total   : number | undefined
    progress: number | undefined
}

export const initRender = (width: number, height: number, objs: Object3D.IObject3D[]) => {
    const state = {
        interact: <Interact.IInteract | undefined>undefined,
        start   : <number | undefined>undefined,
        before  : <number | undefined>undefined,
        total   : <number | undefined>undefined,
        progress: <number | undefined>undefined
    }

    const scene = new THREE.Scene()
    const addedObjs = R.pipe(
        R.filter((obj: Object3D.IObject3D) => obj.addScene),
        (x: any) => R.map((obj: Object3D.IObject3D) => obj.obj, x)
    )(<any>objs)
    scene.add(...addedObjs)

    const camera = new THREE.PerspectiveCamera(60.0, width / height)
    camera.position.set(0.0, 0.0, 3.0)
    camera.lookAt(0.0, 0.0, 0.0)

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    })
    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 1.0)
    renderer.setSize(width, height)

    const three = {
        scene,
        camera,
        renderer
    }

    const intr = Interact.initInteract(three, width, height)
    intr.subscribe(i => state.interact = i)

    window.requestAnimationFrame(animate(three, state, objs))

    return three
}

const animate = (three: IThree, state: IState, objs: Object3D.IObject3D[]) => (timestamp: number) => {
    if (!state.start) {
        state.start = timestamp
    }
    if (!state.before) {
        state.before = timestamp
    }
    state.total    = timestamp - state.start
    state.progress = timestamp - state.before
    state.before = timestamp

    render(three, state, objs)

    window.requestAnimationFrame(animate(three, state, objs))
}

const render = (three: IThree, state: IState, objs: Object3D.IObject3D[]) => {
    R.forEach(obj => obj.update(obj.obj, state), objs)
    three.renderer.render(three.scene, three.camera)
}
