import * as PIXI        from 'pixi.js'
import * as Rx          from 'rxjs'
import * as Animation   from '../animation'
import * as Interaction from '../interaction'

export interface IPixiState {
    application  : PIXI.Application
    render       : (pixiState: IPixiState, animationState: Animation.IAnimationState) => Uint8Array | Uint8ClampedArray
    subscriptions: Rx.Subscription[]
}

export const create = (
    width       : number,
    height      : number,
    interactions: Rx.Observable<Interaction.IInteraction>,
    times       : Rx.Observable<Date>
): IPixiState => {
    const application = new PIXI.Application({
        width,
        height,
        autoStart : false,
        antialias : true,
        preserveDrawingBuffer: true,
        backgroundColor: 0xFFFFFF
    })
    
    const pixiState: IPixiState = {
        application,
        render,
        subscriptions: []
    }

    application.stage.pivot = new PIXI.Point(-width * 0.5, -height * 0.5)

    const graphics = new PIXI.Graphics()
    graphics.beginFill(0xFF4444)
    graphics.drawCircle(0.0, 0.0, height * 0.4)
    graphics.endFill()
    application.stage.addChild(graphics)

    application.ticker.add(tick(pixiState))

    return pixiState
}

export const resizeRenderer = (pixiState: IPixiState, width: number, height: number) => {
    pixiState.application.renderer.resize(width, height)
    pixiState.application.stage.pivot = new PIXI.Point(-width * 0.5, -height * 0.5)
}

const render = (pixiState: IPixiState, animationState: Animation.IAnimationState) => {
    pixiState.application.ticker.update(animationState.total)
    return pixiState.application.renderer.extract.pixels()
}

const tick = (pixiState: IPixiState) => (dt: number) => {
    pixiState.application.render()
}
