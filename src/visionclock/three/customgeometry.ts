import * as THREE from 'three'
import * as R     from 'ramda'

export const create = (
    vertices      : number[],
    indices       : number[],
    attributes   ?: { [name: string]: number[] },
    attributeDims?: { [name: string]: number   }
) => {
    const geometry = new THREE.BufferGeometry()
    
    const vs = createVertices(vertices, indices)
    geometry.addAttribute('position', vs)

    const ns = createNormals(vertices, indices)
    geometry.addAttribute('normal'  , ns)

    if (attributes && attributeDims) {
        const attrs = createAttributes(attributes, attributeDims, indices)
        R.forEachObjIndexed((attr, name) => geometry.addAttribute(name, attr))(attrs)
    }

    return geometry
}

const createVertices = (vertices: number[], indices: number[]) => {
    const vss = R.splitEvery(3, vertices)

    return R.pipe(
        R.map((i: number) => vss[i]),
        vss => R.flatten<number>(vss),
        vs  => new THREE.Float32BufferAttribute(vs, 3)
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
        nss => R.flatten<number>(nss),
        ns  => new THREE.Float32BufferAttribute(ns, 3)
    )(indices)
}

export const createAttributes = (
    attributes   : { [name: string]: number[] },
    attributeDims: { [name: string]: number   },
    indices      : number[]
) => {
    return R.pipe(
        R.mapObjIndexed((attr, name) => <[number[], number]>[attr, attributeDims[name]]),
        R.mapObjIndexed((z: [number[], number]) => createOneAttribute(z[0], z[1], indices))
    )(attributes)
}

const createOneAttribute = (values: number[], dim: number, indices: number[]) => {
    const vss = R.splitEvery(dim, values)

    return R.pipe(
        R.map((i: number) => vss[i]),
        vss => R.flatten<number>(vss),
        vs  => new THREE.Float32BufferAttribute(vs, dim)
    )(indices)
}
