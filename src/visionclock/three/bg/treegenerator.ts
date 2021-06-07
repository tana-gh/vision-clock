import * as THREE      from 'three'
import * as Rx         from 'rxjs'
import * as RxOp       from 'rxjs/operators'
import * as R          from 'ramda'
import * as Animation  from '../../animation'
import * as SceneState from '../scenestate'
import * as Behaviour  from '../behaviour'
import * as TreeObject from './treeobject'
import * as C          from '../../utils/constants'
import * as Random     from '../../utils/random'

export const create = (
    timestamp : number,
    animations: Rx.Observable<Animation.IAnimationState>,
    random    : Random.IRandom,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    material  : THREE.Material,
    position  : THREE.Vector3,
    velocity  : THREE.Vector3,
    direction : THREE.Vector3,
    rotation  : THREE.Vector3,
    objCount  : number,
    depth     : number
): Behaviour.IBehaviour => {
    const generator: Behaviour.IBehaviour = {
        timestamp,
        state: 'init',
        dispose() {
            subscription.unsubscribe()
            material.dispose()
        }
    }
    sceneState.behaviours.add(generator)

    const store = {}

    const subscription = Rx.pipe(
        RxOp.map((a: Animation.IAnimationState) =>
            <[Animation.IAnimationState, number]>
            [a, Math.floor(a.total * C.framePerMillisecond * C.treeGeneratorParams.createFreq)]),
        RxOp.distinctUntilChanged((x, y) => x[1] == y[1]),
        RxOp.map(z => z[0])
    )(animations)
    .subscribe(
        Behaviour.updateByAnimation(
            generator, sceneState, 'main', store, updateByAnimation(
                animations,
                random,
                sceneState,
                parent,
                material,
                position,
                velocity,
                direction,
                rotation,
                objCount,
                depth
            )
        )
    )

    return generator
}

const updateByAnimation = (
    animations: Rx.Observable<Animation.IAnimationState>,
    random    : Random.IRandom,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    material  : THREE.Material,
    position  : THREE.Vector3,
    velocity  : THREE.Vector3,
    direction : THREE.Vector3,
    rotation  : THREE.Vector3,
    objCount  : number,
    depth     : number
) => (obj: Behaviour.IBehaviour, animation: Animation.IAnimationState, store: any) => {
    switch (obj.state) {
        case 'main':
            {
                if (depth === 0) {
                    obj.state = 'terminate'
                    return
                }

                if (store.position === undefined) {
                    store.position = position.clone()
                }

                if (store.velocity === undefined) {
                    store.velocity = velocity.clone()
                }

                if (store.scale === undefined) {
                    store.scale =
                        C.treeGeneratorParams.minRadius +
                        (C.treeGeneratorParams.maxRadius - C.treeGeneratorParams.minRadius) * depth
                }

                if (store.count === undefined) {
                    store.count = 0
                }

                TreeObject.create(
                    Date.now(),
                    animations,
                    sceneState,
                    parent,
                    material.clone(),
                    store.position.clone().setZ(0.0),
                    new THREE.Vector3(random.next() - 0.5, random.next() - 0.5, 0.0)
                        .normalize()
                        .multiplyScalar(C.treeGeneratorParams.objVelocity),
                    store.scale,
                    new THREE.Color().setHSL(random.next(), 1.0, C.treeGeneratorParams.hslLightness),
                    C.treeGeneratorParams.lightness
                )

                const ratio =
                    (depth - 1 + (objCount - store.count - 0.5) / objCount) /
                    (depth - 1 + (objCount - store.count      ) / objCount)
                
                store.position.add(store.velocity)
                store.velocity.multiplyScalar(ratio).add(
                    new THREE.Vector3(random.next() - 0.5, random.next() - 0.5, 0.0)
                        .multiplyScalar(C.treeGeneratorParams.noise)
                )
                store.scale *= ratio
                store.count++

                if (store.count >= objCount) {
                    createSubTrees(
                        animations,
                        random,
                        sceneState,
                        parent,
                        material,
                        store.position,
                        store.velocity,
                        direction,
                        rotation,
                        objCount,
                        depth
                    )
                    obj.state = 'terminate'
                }
            }
            return
        default:
            throw 'Invalid state'
    }
}

const createSubTrees = (
    animations: Rx.Observable<Animation.IAnimationState>,
    random    : Random.IRandom,
    sceneState: SceneState.ISceneState,
    parent    : THREE.Object3D,
    material  : THREE.Material,
    position  : THREE.Vector3,
    velocity  : THREE.Vector3,
    direction : THREE.Vector3,
    rotation  : THREE.Vector3,
    objCount  : number,
    depth     : number
) => {
    R.forEach((i: number) => {
        const rot = 
            C.treeGeneratorParams.subTreeCount % 2 === 0 ?
            (i * 2 - C.treeGeneratorParams.subTreeCount + 1)   * C.treeGeneratorParams.subTreeRollX * 0.5 :
            (i - (C.treeGeneratorParams.subTreeCount - 1) / 2) * C.treeGeneratorParams.subTreeRollX
        const vel = velocity .clone().applyAxisAngle(rotation, rot)
        const dir = direction.clone().applyAxisAngle(rotation, rot)
        
        create(
            Date.now(),
            animations,
            random,
            sceneState,
            parent,
            material.clone(),
            position,
            vel,
            dir,
            rotation,
            objCount,
            depth - 1
        )
    })(R.range(0, C.treeGeneratorParams.subTreeCount))
}
