import * as THREE         from 'three'
import * as Rx            from 'rxjs'
import * as R             from 'ramda'
import * as Animation     from '../../animation'
import * as SceneState    from '../scenestate'
import * as DisplayObject from '../displayobject'
import * as C             from '../../utils/constants'

export const create = (
    timestamp : number,
    animations: Rx.Observable<Animation.IAnimationState>,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D
): DisplayObject.IDisplayObject => {
    const lights = new THREE.Object3D()
    
    R.forEach(param => {
        const light = new THREE.PointLight(new THREE.Color(param.color))
        light.position.set(param.x, param.y, param.z)
        lights.add(light)
    }, C.lightParams)
    
    const obj: DisplayObject.IDisplayObject = {
        rootElement: lights,
        elements   : {
            lights
        },
        timestamp,
        state: 'init',
        dispose() {
            subscription.unsubscribe()
        }
    }

    const store = {}

    const subscription = animations.subscribe(
        DisplayObject.updateByAnimation(obj, sceneState, parent, 'main', store, updateByAnimation)
    )

    return obj
}

const updateByAnimation = (obj: DisplayObject.IDisplayObject, animation: Animation.IAnimationState, store: any) => {
    switch (obj.state) {
        case 'main':
            return
        default:
            throw 'Invalid state'
    }
}
