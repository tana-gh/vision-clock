import * as THREE from 'three'
import * as R     from 'ramda'

const modelSize  = 0.15
const boneLength = 1.0

export const create = (count: number) => {
    return comp(count)(R.range(0, count))
}

const toHue = (count: number) => (x: number) => R.clamp(0.0, 1.0, x / count)

const toMaterial = (hue: number) => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color().setHSL(hue, 1.0, 0.8),
    metalness: 0.5,
    roughness: 0.5,
    clearCoat: 0.5,
    clearCoatRoughness: 0.5,
    reflectivity: 1.0,
    fog: true
})

const geometry = () => new THREE.BoxGeometry(modelSize, modelSize, modelSize)

const toMesh = (material: THREE.Material) => new THREE.Mesh(geometry(), material)

const axis = () => new THREE.Vector3(0.0, boneLength, 0.0)

const setAttr = (model: THREE.Mesh) => {
    model.translateOnAxis(axis(), 1.0)
}

const comp = (count: number) => R.pipe(
    R.map(toHue(count)),
    R.map(toMaterial),
    R.map(toMesh),
    R.forEach(setAttr)
)
