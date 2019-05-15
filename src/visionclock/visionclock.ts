import * as ThreeState  from './three/threestate'
import * as PixiState   from './pixi/pixistate'
import * as Animation   from './animation'
import * as Interaction from './interaction'
import * as Time        from './time'
import * as Renderer    from './renderer'
import * as Random      from './utils/random'

export interface IVisionClockState {
    pixiState   : PixiState .IPixiState
    threeState  : ThreeState.IThreeState
    dispose     : () => void
}

export const load = (parent: HTMLElement): IVisionClockState => {
    const animations   = Animation.create(Date.now())
    const interactions = Interaction.create(animations, parent, window)
    const times        = Time.create(animations)
    const random       = Random.create(Date.now())
    
    const pixiState    = PixiState .create(parent.clientWidth, parent.clientHeight, animations, interactions, times, random)
    const threeState   = ThreeState.create(parent.clientWidth, parent.clientHeight, animations, interactions, times, random)

    const subscription = animations.subscribe(Renderer.render(pixiState, threeState))

    parent.appendChild(threeState.renderer.domElement)

    const resize = () => {
        PixiState .resizeRenderer(pixiState , parent.clientWidth, parent.clientHeight)
        ThreeState.resizeRenderer(threeState, parent.clientWidth, parent.clientHeight)
    }
    window.addEventListener('resize', resize)

    const dispose = () => {
        subscription.unsubscribe()
        pixiState .dispose!()
        threeState.dispose!()
        window.removeEventListener('resize', resize)
    }

    return { pixiState, threeState, dispose }
}
