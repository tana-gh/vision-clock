import * as THREE from 'three'
import * as R     from 'ramda'

export const create = (
    vertexShader  : string,
    fragmentShader: string,
    uniforms?     : { [name: string]: number | number[] }
): THREE.ShaderMaterial => {
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        blending: THREE.AdditiveBlending
    })

    if (uniforms) {
        const unis = createUniforms(uniforms)
        material.uniforms = unis
    }

    return material
}

export const createUniforms = (uniforms: { [name: string]: number | number[] }): Record<string, THREE.Uniform> => {
    return R.mapObjIndexed(value => new THREE.Uniform(value))(uniforms)
}
