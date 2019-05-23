import * as Rx                    from 'rxjs'
import * as Animation             from '../../animation'
import * as Interaction           from '../../interaction'
import * as RendererState         from '../rendererstate'
import * as ShaderSceneState      from './shaderscenestate'
import * as MovingCircleGenerator from './movingcirclegenerator'
import * as Random                from '../../utils/random'

export const create = (
    animations  : Rx.Observable<Animation.IAnimationState>,
    interactions: Rx.Observable<Interaction.IInteraction[]>,
    times       : Rx.Observable<Date>,
    random      : Random.IRandom,
    aspectObj   : RendererState.IAspect
) => {
    return ShaderSceneState.create(
        aspectObj,
        (sceneState, scene) => {
            MovingCircleGenerator.create(
                Date.now(),
                animations,
                random,
                sceneState,
                scene,
                aspectObj
            )
        },
        true
    )
}
