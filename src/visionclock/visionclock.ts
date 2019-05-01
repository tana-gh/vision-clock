import * as ThreeState  from './three/threestate'
import * as PixiState   from './pixi/pixistate'
import * as Animation   from './animation'
import * as Interaction from './interaction'
import * as Time        from './time'

export interface IVisionClockState {
    threeState: ThreeState.IThreeState
    pixiState : PixiState .IPixiState
}

export const load = (parent: HTMLElement): IVisionClockState => {
    const interactions = Interaction.create(parent, window)
    const times        = Time.create()
    const threeState   = ThreeState.create(parent.clientWidth, parent.clientHeight, interactions, times)
    const pixiState    = PixiState .create(parent.clientWidth, parent.clientHeight, interactions, times)
    //parent.appendChild(threeState.renderer.domElement)
    parent.appendChild(pixiState.application.view)
    // window.addEventListener('resize', () => 
    //     ThreeState.resizeRenderer(threeState, parent.clientWidth, parent.clientHeight))
    window.addEventListener('resize', () => 
        PixiState.resizeRenderer(pixiState, parent.clientWidth, parent.clientHeight))
    window.requestAnimationFrame(Animation.animate(threeState, pixiState, {}))
    return { threeState, pixiState }
}
