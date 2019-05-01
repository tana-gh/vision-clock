import * as THREE from 'three'
import * as R     from 'ramda'

export const create = (vertices: number[], indices: number[]) => {
    const geometry = new THREE.BufferGeometry()
    const vs       = createVertices(vertices, indices)
    const normals  = createNormals (vertices, indices)

    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vs     , 3))
    geometry.addAttribute('normal'  , new THREE.Float32BufferAttribute(normals, 3))

    return geometry
}

const createVertices = (vertices: number[], indices: number[]) => {
    const vss = R.splitEvery(3, vertices)

    return R.pipe(
        R.map((i: number) => vss[i]),
        v => R.flatten<number>(v)
    )(indices)
}

const createNormals = (vertices: number[], indices: number[]) => {
    const vss = R.splitEvery(3, vertices)

    return R.pipe(
        R.map((i: number) => vss[i]),
        R.map(v => new THREE.Vector3(v[0], v[1], v[2])),
        R.splitEvery(3),
        R.map((vs: THREE.Vector3[]) => vs[1].sub(vs[0]).cross(vs[2].sub(vs[0])).normalize()),
        R.map(n => [n.x, n.y, n.z]),
        R.chain(n => [n, n, n]),
        n => R.flatten<number>(n)
    )(indices)
}
