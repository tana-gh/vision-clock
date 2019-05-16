import * as Animation     from './animation'
import * as Interaction   from './interaction'
import * as Time          from './time'
import * as RendererState from './three/rendererstate'
import * as ClockState    from './three/clock/clockstate'
import * as Random        from './utils/random'

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
    const clockState      = ClockState   .create(width, height, animations, interactions, times, random)
    const rendererState   = RendererState.create(width, height, [ clockState ])

    const subscription = animations.subscribe(rendererState.render!)

    parent.appendChild(rendererState.renderer.domElement)

    const resize = () => {
        rendererState.resize!(width, height)
    }
    window.addEventListener('resize', resize)

    const dispose = () => {
        subscription.unsubscribe()
        rendererState.dispose!()
        window.removeEventListener('resize', resize)
    }

    return { rendererState, dispose }
}
