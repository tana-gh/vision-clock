import * as THREE       from 'three'
import * as R           from 'ramda'
import * as ThreeState  from './threestate'
import * as ThreeObject from './threeobject'
import * as Animation   from '../animation'
import * as Interaction from '../interaction'
import * as C           from '../utils/constants'

export const create = (
    threeState: ThreeState.IThreeState,
    parent    : THREE.Object3D,
    timestamp : number
): ThreeObject.IThreeObject => {
    const lights = new THREE.Object3D()
    
    R.forEach(param => {
        const light = new THREE.PointLight(new THREE.Color(param.color))
        light.position.set(param.x, param.y, param.z)
        lights.add(light)
    }, C.lightParams)
    
    const obj: ThreeObject.IThreeObject = {
        elements: {
            lights
        },
        threeState,
        parent,
        timestamp,
        state: 'init'
    }

    obj.updateByAnimation   = updateByAnimation  (obj)
    obj.updateByInteraction = updateByInteraction(obj)
    obj.updateByTime        = updateByTime       (obj)
    obj.dispose             = dispose            (obj)

    return obj
}

const updateByAnimation = (obj: ThreeObject.IThreeObject) => (animation: Animation.IAnimationState) => {
    switch (obj.state) {
        case 'init':
            obj.state = 'main'
            updateByAnimation(obj)(animation)
            return
        case 'main':
            return
        case 'terminate':
            return
        default:
            throw 'Invalid state'
    }
}

const updateByInteraction = (obj: ThreeObject.IThreeObject) => (interaction: Interaction.IInteraction) => {
}

const updateByTime = (obj: ThreeObject.IThreeObject) => (time: Date) => {
}

const dispose = (obj: ThreeObject.IThreeObject) => () => {
}
