import * as PIXI               from 'pixi.js'
import * as Animation          from '../animation'
import * as PixiState          from './pixistate'
import * as PixiObject         from './pixiobject'
import * as SimpleCircleObject from './simplecircleobject'

export const create = (
    x        : number,
    y        : number,
    radius   : number,
    color    : number,
    pixiState: PixiState.IPixiState,
    parent   : PIXI.Container,
    timestamp: number,
    vx       : number,
    vy       : number,
    isAlive  : (x: number, y: number) => boolean
): PixiObject.IPixiObject => {
    return SimpleCircleObject.create(
        x,
        y,
        radius,
        color,
        pixiState,
        parent,
        timestamp,
        updateByAnimation(vx, vy, isAlive)
    )
}

const updateByAnimation = (vx: number, vy: number, isAlive: (x: number, y: number) => boolean) =>
(obj: PixiObject.IPixiObject) => (animation: Animation.IAnimationState) => {
    switch (obj.state) {
        case 'init':
            obj.state = 'main'
            updateByAnimation(vx, vy, isAlive)(obj)(animation)
            return
        case 'fade-in':
            return
        case 'main':
            obj.elements.circle.x += vx * animation.progress
            obj.elements.circle.y += vy * animation.progress
            if (!isAlive(obj.elements.circle.x, obj.elements.circle.y)) {
                obj.state = 'terminate'
            }
            return
        case 'fade-out':
            return
        case 'terminate':
            return
        default:
            throw 'Invalid state'
    }
}
