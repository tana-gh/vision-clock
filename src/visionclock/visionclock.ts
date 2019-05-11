import * as Rx          from 'rxjs'
import * as ThreeState  from './three/threestate'
import * as PixiState   from './pixi/pixistate'
import * as Animation   from './animation'
import * as Interaction from './interaction'
import * as Time        from './time'
import * as Renderer    from './renderer'
import * as Random      from './utils/random'

export interface IVisionClockState {
    subscription: Rx.Subscription
    pixiState   : PixiState .IPixiState
    threeState  : ThreeState.IThreeState
}

export const load = (parent: HTMLElement): IVisionClockState => {
    const animations   = Animation.create(Date.now())
    const interactions = Interaction.create(animations, parent, window)
    const times        = Time.create(animations)
    Random.set(Date.now())
    
    const pixiState    = PixiState .create(parent.clientWidth, parent.clientHeight, animations, interactions, times)
    const threeState   = ThreeState.create(parent.clientWidth, parent.clientHeight, animations, interactions, times)

    const subscription = animations.subscribe(Renderer.render(pixiState, threeState))

    parent.appendChild(threeState.renderer.domElement)
    window.addEventListener('resize', () => {
        PixiState .resizeRenderer(pixiState , parent.clientWidth, parent.clientHeight)
        ThreeState.resizeRenderer(threeState, parent.clientWidth, parent.clientHeight)
    })

    return { subscription, pixiState, threeState }
}

export const dispose = () => {
    if ('visionClockState' in window) {
        const vc: IVisionClockState = (<any>window).visionClockState
        vc.subscription.unsubscribe()
        PixiState .dispose(vc.pixiState)
        ThreeState.dispose(vc.threeState)
    }
}
