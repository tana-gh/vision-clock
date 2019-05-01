import * as THREE       from 'three'
import * as R           from 'ramda'
import * as ThreeObject from './threeobject'
import * as Animation   from '../animation'
import * as Interaction from '../interaction'
import * as C           from '../utils/constants'

export const create = (): ThreeObject.IThreeObject => {
    const lights = new THREE.Object3D()
    
    R.forEach(param => {
        const light = new THREE.PointLight(new THREE.Color(param.color))
        light.position.set(param.x, param.y, param.z)
        lights.add(light)
    }, C.lightParams)
    
    return {
        elements: {
            lights
        },
        updateByAnimation,
        updateByInteraction,
        updateByTime
    }
}

const updateByAnimation = (obj: ThreeObject.IThreeObject, animation: Animation.IAnimationState) => {
}

const updateByInteraction = (obj: ThreeObject.IThreeObject, interaction: Interaction.IInteraction) => {
}

const updateByTime = (obj: ThreeObject.IThreeObject, time: Date) => {
}
