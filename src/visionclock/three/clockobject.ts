import * as THREE          from 'three'
import * as R              from 'ramda'
import * as ThreeObject    from './threeobject'
import * as CustomGeometry from './customgeometry'
import * as Animation      from '../animation'
import * as Interaction    from '../interaction'
import * as C              from '../utils/constants'

export const create = ({
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
    baseScaleGap
} = C.clockParams): ThreeObject.IThreeObject => {
    const material   = createMaterial()
    const hourHand   = createHand(hourHandLength  , hourHandWidth  , hourHandHeight  , hourHandHeight, 0.0, material)
    const minuteHand = createHand(minuteHandLength, minuteHandWidth, minuteHandHeight, hourHandHeight + minuteHandHeight, 0.0, material)
    const secondHand = createHand(secondHandLength, secondHandWidth, secondHandHeight, hourHandHeight + minuteHandHeight + secondHandHeight, secondHandBack, material)
    const scales     = createAllScales(radius, scaleLength, scaleWidth, scaleHeight, baseScaleGap, material)
    const clock      = new THREE.Object3D().add(hourHand, minuteHand, secondHand, scales)
    return {
        elements: {
            clock,
            hourHand,
            minuteHand,
            secondHand,
            scales
        },
        updateByAnimation,
        updateByInteraction,
        updateByTime
    }
}

const createMaterial = () => {
    return new THREE.MeshPhysicalMaterial(C.clockMaterial)
}

const createHand = (
    length  : number,
    width   : number,
    height  : number,
    z       : number,
    back    : number,
    material: THREE.Material
) => {
    const vertices = R.map(C.mapVertices(length, width, height, z, back))(C.clockHandVertices)
    const geometry = CustomGeometry.create(vertices, C.clockHandIndices)
    return new THREE.Mesh(geometry, material)
}

const createAllScales = (
    radius  : number,
    length  : number,
    width   : number,
    height  : number,
    gap     : number,
    material: THREE.Material
) => {
    const vertices = R.map(C.mapVertices(length, width, height, 0.0, 0.0))(C.clockScaleVertices)
    const scales   = R.map(createOneScale(radius, vertices, material))(R.range(0, 13))
    scales[ 0].translateX( gap)
    scales[12].translateX(-gap)
    return new THREE.Object3D().add(...scales)
}

const createOneScale = (radius: number, vertices: number[], material: THREE.Material) => (index: number) => {
    const geometry = CustomGeometry.create(vertices, C.clockScaleIndices)
    const mesh     = new THREE.Mesh(geometry, material).translateY(radius)
    return new THREE.Object3D().add(mesh).rotateZ(-index * 2 * Math.PI / 12)
}

const updateByAnimation = (obj: ThreeObject.IThreeObject, animation: Animation.IAnimationState) => {
}

const updateByInteraction = (obj: ThreeObject.IThreeObject, interaction: Interaction.IInteraction) => {
    const axis = interaction.position
                 .clone()
                 .cross(new THREE.Vector3(0.0, 0.0, -1.0))
                 .normalize()
    
    obj.elements.clock.setRotationFromAxisAngle(axis, interaction.position.length() * C.clockRotationAngle)
}

const updateByTime = (obj: ThreeObject.IThreeObject, time: Date) => {
    const [h, m, s] = [time.getHours(), time.getMinutes(), time.getSeconds()]

    updateHandByTime(obj.elements.hourHand  , (h % 12 * 60 * 60 + m * 60 + s) / (12 * 60 * 60))
    updateHandByTime(obj.elements.minuteHand, (m * 60 + s) / (60 * 60))
    updateHandByTime(obj.elements.secondHand, s / 60)
}

const updateHandByTime = (hand: THREE.Object3D, ratio: number) => {
    hand.setRotationFromAxisAngle(new THREE.Vector3(0.0, 0.0, -1.0), 2.0 * Math.PI * ratio)
}
