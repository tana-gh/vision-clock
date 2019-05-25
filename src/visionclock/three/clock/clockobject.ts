import * as THREE          from 'three'
import * as Rx             from 'rxjs'
import * as R              from 'ramda'
import * as Animation      from '../../animation'
import * as Interaction    from '../../interaction'
import * as SceneState     from '../scenestate'
import * as DisplayObject  from '../displayobject'
import * as CustomGeometry from '../customgeometry'
import * as C              from '../../utils/constants'

export const create = (
    timestamp   : number,
    animations  : Rx.Observable<Animation.IAnimationState>,
    interactions: Rx.Observable<Interaction.IInteraction[]>,
    times       : Rx.Observable<Date>,
    sceneState  : SceneState.ISceneState,
    parent      : THREE.Object3D,
    {
        radius,
        hourHandLength,
        hourHandWidth,
        hourHandHeight,
        minuteHandLength,
        minuteHandWidth,
        minuteHandHeight,
        secondHandLength,
        secondHandBack,
        secondHandWidth,
        secondHandHeight,
        scaleLength,
        scaleWidth,
        scaleHeight,
        baseScaleGap,
        frameRadius,
        frameZ,
        frameSegments,
        frameOpacity
    } = C.clockParams
): DisplayObject.IDisplayObject => {
    const material   = createMaterial()
    const hourHand   = createHand(hourHandLength  , hourHandWidth  , hourHandHeight  , hourHandHeight, 0.0, material[0])
    const minuteHand = createHand(minuteHandLength, minuteHandWidth, minuteHandHeight, hourHandHeight + minuteHandHeight, 0.0, material[0])
    const secondHand = createHand(secondHandLength, secondHandWidth, secondHandHeight, hourHandHeight + minuteHandHeight + secondHandHeight, secondHandBack, material[0])
    const scales     = createAllScales(radius, scaleLength, scaleWidth, scaleHeight, baseScaleGap, material[0])
    const frame      = createFrame(frameRadius, frameZ, frameSegments, frameOpacity, material[0])
    const clock      = new THREE.Object3D().add(hourHand[0], minuteHand[0], secondHand[0], scales[0], frame[0])
    const obj: DisplayObject.IDisplayObject = {
        rootElement: clock,
        elements   : {
            hourHand  : hourHand  [0],
            minuteHand: minuteHand[0],
            secondHand: secondHand[0],
            scales    : scales    [0],
            frame     : frame     [0]
        },
        timestamp,
        state: 'init',
        dispose() {
            R.juxt([
                () => R.forEach((s: Rx.Subscription) => s.unsubscribe())(subscriptions),
                material  [1],
                hourHand  [1],
                minuteHand[1],
                secondHand[1],
                scales    [1],
                frame     [1]
            ])()
        }
    }

    const store = {}

    const subscriptions = [
        animations.subscribe(
            DisplayObject.updateByAnimation(obj, sceneState, parent, 'main', store, updateByAnimation)
        ),
        interactions.subscribe(
            updateByInteraction(obj)
        ),
        times.subscribe(
            updateByTime(obj)
        ),
    ]
    
    return obj
}

const createMaterial = (): [THREE.Material, () => void] => {
    const material = new THREE.MeshPhysicalMaterial(C.clockMaterial)
    return [
        material,
        () => material.dispose()
    ]
}

const createHand = (
    length  : number,
    width   : number,
    height  : number,
    z       : number,
    back    : number,
    material: THREE.Material
): [THREE.Object3D, () => void] => {
    const vertices = R.map(C.mapVertices(length, width, height, z, back))(C.clockHandVertices)
    const geometry = CustomGeometry.create(vertices, C.clockHandIndices)
    return [
        new THREE.Mesh(geometry, material),
        () => geometry.dispose()
    ]
}

const createAllScales = (
    radius  : number,
    length  : number,
    width   : number,
    height  : number,
    gap     : number,
    material: THREE.Material
): [THREE.Object3D, () => void] => {
    const vertices = R.map(C.mapVertices(length, width, height, 0.0, 0.0))(C.clockScaleVertices)
    const scales   = R.map(createOneScale(radius, vertices, material))(R.range(0, 13))
    scales[ 0][0].translateX( gap)
    scales[12][0].translateX(-gap)
    return [
        new THREE.Object3D().add(...R.map(s => s[0])(scales)),
        () => R.forEach(s => s[1]())(scales)
    ]
}

const createOneScale = (
    radius  : number,
    vertices: number[],
    material: THREE.Material
) => (index: number): [THREE.Object3D, () => void] => {
    const geometry = CustomGeometry.create(vertices, C.clockScaleIndices)
    const mesh     = new THREE.Mesh(geometry, material).translateY(radius)
    return [
        new THREE.Object3D().add(mesh).rotateZ(-index * 2 * Math.PI / 12),
        () => geometry.dispose()
    ]
}

const createFrame = (
    frameRadius  : number,
    frameZ       : number,
    frameSegments: number,
    frameOpacity : number,
    material: THREE.Material
): [THREE.Object3D, () => void] => {
    const geometry    = new THREE.CircleGeometry(frameRadius, frameSegments).translate(0.0, 0.0, frameZ)
    const newMaterial = <THREE.MeshPhysicalMaterial>material.clone()
    newMaterial.transparent = true
    newMaterial.opacity     = frameOpacity
    return [
        new THREE.Mesh(geometry, newMaterial),
        () => geometry.dispose()
    ]
}

const updateByAnimation = (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState, store: any) => {
    switch (obj.state) {
        case 'main':
            return
        default:
            throw 'Invalid state'
    }
}

const updateByInteraction = (obj: DisplayObject.IDisplayObject) => (interactions: Interaction.IInteraction[]) => {
    switch (obj.state) {
        case 'init':
            return
        case 'main':
            R.forEach((i: Interaction.IInteraction) => {
                const axis = i.position
                    .clone()
                    .cross(new THREE.Vector3(0.0, 0.0, -1.0))
                    .normalize()
                obj.rootElement.setRotationFromAxisAngle(axis, i.position.length() * C.clockRotationAngle)
            })(interactions)
            return
        case 'terminate':
            return
        default:
            throw 'Invalid state'
    }
    
}

const updateByTime = (obj: DisplayObject.IDisplayObject) => (time: Date) => {
    switch (obj.state) {
        case 'init':
            return
        case 'main':
            const [h, m, s] = [time.getHours(), time.getMinutes(), time.getSeconds()]
            updateHandByTime(obj.elements.hourHand  , (h % 12 * 60 * 60 + m * 60 + s) / (12 * 60 * 60))
            updateHandByTime(obj.elements.minuteHand, (m * 60 + s) / (60 * 60))
            updateHandByTime(obj.elements.secondHand, s / 60)
            return
        case 'terminate':
            return
        default:
            throw 'Invalid state'
    }
}

const updateHandByTime = (hand: THREE.Object3D, ratio: number) => {
    hand.setRotationFromAxisAngle(new THREE.Vector3(0.0, 0.0, -1.0), 2.0 * Math.PI * ratio)
}
