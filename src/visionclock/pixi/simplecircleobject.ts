import * as PIXI       from 'pixi.js'
import * as Animation  from '../animation'
import * as PixiState  from './pixistate'
import * as PixiObject from './pixiobject'

export const create = (
    x        : number,
    y        : number,
    radius   : number,
    color    : number,
    pixiState: PixiState.IPixiState,
    parent   : PIXI.Container,
    timestamp: number,
    updateByAnimation: (obj: PixiObject.IPixiObject) => (animation: Animation.IAnimationState) => void
): PixiObject.IPixiObject => {
    const circle = new PIXI.Graphics()
        .beginFill(color)
        .drawCircle(0.0, 0.0, radius)
        .endFill()
    circle.x = x
    circle.y = y

    const obj: PixiObject.IPixiObject = {
        elements: {
            circle
        },
        pixiState,
        parent,
        timestamp,
        state: 'init',
    }

    obj.updateByAnimation   = updateByAnimation  (obj),
    obj.updateByInteraction = updateByInteraction(obj),
    obj.updateByTime        = updateByTime       (obj),
    obj.dispose             = dispose            (obj)
    
    return obj
}

const updateByInteraction = (obj: PixiObject.IPixiObject) => () => {}

const updateByTime = (obj: PixiObject.IPixiObject) => () => {}

const dispose = (obj: PixiObject.IPixiObject) => () => {
    obj.elements.circle.destroy()
}
