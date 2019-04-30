import * as THREE          from 'three'
import * as R              from 'ramda'
import * as ThreeObject    from './threeobject'
import * as CustomGeometry from './customgeometry'
import * as Animation      from './animation'
import * as Interaction    from './interaction'
import * as C              from './utils/constants'

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
    scaleHeight
} = C.clockParams): ThreeObject.IThreeObject => {
    const material = createMaterial()
    const scales   = createAllScales(radius, scaleLength, scaleWidth, scaleHeight, material)

    return {
        obj: new THREE.Object3D().add(scales),
        updateByAnimation,
        updateByInteraction
    }
}

const createMaterial = () => {
    return new THREE.MeshPhysicalMaterial(C.clockMaterial)
}

const createAllScales = (radius: number, length: number, width: number, height: number, material: THREE.Material) => {
    const vertices = R.map(C.mapVertices(length, 0.0, width, height))(C.clockScaleVertices)
    const scales   = R.map(createOneScale(radius, vertices, material))(R.range(0, 12))
    return new THREE.Object3D().add(...scales)
}

const createOneScale = (radius: number, vertices: number[], material: THREE.Material) => (index: number) => {
    const geometry = CustomGeometry.create(vertices, C.clockScaleIndices)
    const mesh     = new THREE.Mesh(geometry, material).translateY(radius)
    return new THREE.Object3D().add(mesh).rotateZ(-index * 2 * Math.PI / 12)
}

const updateByAnimation = (
    obj      : THREE.Object3D,
    animation: Animation.IAnimationState
) => {
    return obj
}

const updateByInteraction = (
    obj        : THREE.Object3D,
    interaction: Interaction.IInteraction
) => {
    if (!interaction.button1) {
        return obj
    }

    const axis = interaction.movement
                    .clone()
                    .cross(new THREE.Vector3(0.0, 0.0, -1.0))
                    .normalize()
    
    return obj.rotateOnWorldAxis(axis, interaction.movement.length())
}
