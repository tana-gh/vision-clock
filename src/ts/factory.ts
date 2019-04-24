import * as THREE  from 'three'
import * as R      from 'ramda'
import * as Render from './render'
import * as Model  from './model'
import * as Light  from './light'

const totalFreq = 1.0

const mthFreq = 0.2
const mphFreq = 0.3

const lphFreq = 0.1

export const createAll = () => {
    const models     = Model.create(12)
    const modelBones = R.map(m => new THREE.Bone(), models)
    const dph = 2.0 * Math.PI / models.length

    R.pipe(
        (x, y) => R.zip(x, y),
        R.forEach(z => placeModel(<THREE.Object3D>z[0], <THREE.Object3D>z[1], dph))
    )(modelBones, models)
    
    R.reduce((b1, b2) => {
        if (b1 !== null) {
            b1!.add(b2)
        }
        return b2
    }, <THREE.Bone | null>null, modelBones)

    const modelRoot = new THREE.Bone()
    modelRoot.add(modelBones[0])

    const lights    = Light.create(12)
    const lightBone = new THREE.Bone()
    R.forEach(l => lightBone.add(l), lights)

    return [
        {
            obj     : modelRoot,
            update  : updateModelRoot,
            addScene: true
        },
        {
            obj     : modelBones[0],
            update  : updateModelBone,
            addScene: false
        },
        {
            obj     : lightBone,
            update  : updateLightBone,
            addScene: true
        }
    ]
}

const placeModel = (parent: THREE.Object3D, child: THREE.Object3D, dph: number) => {
    parent.add(child)
    parent.rotateZ(dph)
}

const updateModelRoot = (obj: THREE.Object3D, state: Render.IState) => {
    const th = state.progress! / 1000.0 * 2.0 * Math.PI * mthFreq * totalFreq
    obj.rotateX(th)
}

const updateModelBone = (obj: THREE.Object3D, state: Render.IState) => {
    const ph = -state.progress! / 1000.0 * 2.0 * Math.PI * mphFreq * totalFreq
    obj.rotateZ(ph)
}

const updateLightBone = (obj: THREE.Object3D, state: Render.IState) => {
    const ph = state.progress! / 1000.0 * 2.0 * Math.PI * lphFreq * totalFreq
    obj.rotateY(ph)
}
