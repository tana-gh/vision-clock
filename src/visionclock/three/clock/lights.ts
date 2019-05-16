import * as THREE         from 'three'
import * as R             from 'ramda'
import * as Animation     from '../../animation'
import * as Interaction   from '../../interaction'
import * as SceneState    from '../scenestate'
import * as DisplayObject from '../displayobject'
import * as C             from '../../utils/constants'

export const create = (
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    timestamp : number
): DisplayObject.IDisplayObject => {
    const lights = new THREE.Object3D()
    
    R.forEach(param => {
        const light = new THREE.PointLight(new THREE.Color(param.color))
        light.position.set(param.x, param.y, param.z)
        lights.add(light)
    }, C.lightParams)
    
    const obj: DisplayObject.IDisplayObject = {
        elements: {
            lights
        },
        sceneState,
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

const updateByAnimation = (obj: DisplayObject.IDisplayObject) => (animation: Animation.IAnimationState) => {
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

const updateByInteraction = (obj: DisplayObject.IDisplayObject) => (interaction: Interaction.IInteraction) => {
}

const updateByTime = (obj: DisplayObject.IDisplayObject) => (time: Date) => {
}

const dispose = (obj: DisplayObject.IDisplayObject) => () => {
}
