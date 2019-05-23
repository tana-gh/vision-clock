import * as Animation        from './animation'
import * as Interaction      from './interaction'
import * as Time             from './time'
import * as RendererState    from './three/rendererstate'
import * as BgSceneState     from './three/bg/bgscenestate'
import * as ObjectSceneState from './three/bg/objectscenestate'
import * as ClockSceneState  from './three/clock/clockscenestate'
import * as Random           from './utils/random'

export interface IVisionClockState {
    rendererState: RendererState.IRendererState
    dispose      : () => void
}

export const load = (parent: HTMLElement): IVisionClockState => {
    const now          = Date.now()
    const animations   = Animation  .create(now)
    const interactions = Interaction.create(animations, parent, window)
    const times        = Time       .create(animations)
    const random       = Random     .create(now)

    const [width, height] = [parent.clientWidth, parent.clientHeight]
    const rendererState   = RendererState.create(
        width,
        height
    )
    
    const bgSceneState     = BgSceneState    .create(animations, interactions, times, random, rendererState.aspectObj)
    const objectSceneState = ObjectSceneState.create(animations, interactions, times, random, rendererState.aspectObj)
    const clockSceneState  = ClockSceneState .create(animations, interactions, times, random, rendererState.aspectObj)
    
    RendererState.setScenes(
        rendererState,
        bgSceneState,
        objectSceneState,
        clockSceneState
    )

    const subscription = animations.subscribe(a => rendererState.render(a))

    parent.appendChild(rendererState.renderer.domElement)

    const resize = () => rendererState.resize(parent.clientWidth, parent.clientHeight)
    window.addEventListener('resize', resize)

    const dispose = () => {
        subscription.unsubscribe()
        rendererState.dispose()
        window.removeEventListener('resize', resize)
    }

    return { rendererState, dispose }
}
