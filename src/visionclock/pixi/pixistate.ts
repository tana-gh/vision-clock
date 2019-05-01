import * as PIXI        from 'pixi.js'
import * as Rx          from 'rxjs'
import * as Interaction from '../interaction'

export interface IPixiState {
    application  : PIXI.Application
    subscriptions: Rx.Subscription[]
}

export const create = (
    width       : number,
    height      : number,
    interactions: Rx.Observable<Interaction.IInteraction>,
    times       : Rx.Observable<Date>
): IPixiState => {
    const pixiState: IPixiState = {
        application: new PIXI.Application({
            width,
            height,
            autoStart : false,
            autoResize: true,
            antialias : true,
            resolution: 2
        }),
        subscriptions: []
    }
    
    const graphics = new PIXI.Graphics()
    graphics.beginFill(0xFF4444)
    graphics.drawCircle(width * 0.5, height * 0.5, height * 0.4)
    graphics.endFill()
    pixiState.application.stage.addChild(graphics)

    return pixiState
}

export const resizeRenderer = (pixiState: IPixiState, width: number, height: number) => {
    pixiState.application.renderer.resize(width, height)
}
