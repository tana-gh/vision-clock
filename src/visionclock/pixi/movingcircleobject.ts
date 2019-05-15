import * as PIXI               from 'pixi.js'
import * as Color              from 'color'
import * as Animation          from '../animation'
import * as PixiState          from './pixistate'
import * as PixiObject         from './pixiobject'
import * as SimpleCircleObject from './simplecircleobject'

export const create = (
    x        : number,
    y        : number,
    radius   : number,
    color    : number,
    blendMode: number,
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
        blendMode,
        pixiState,
        parent,
        timestamp,
        updateByAnimation(radius, color, vx, vy, isAlive)
    )
}

const updateByAnimation = (radius: number, color: number, vx: number, vy: number, isAlive: (x: number, y: number) => boolean) =>
(obj: PixiObject.IPixiObject) => (animation: Animation.IAnimationState) => {
    switch (obj.state) {
        case 'init':
            obj.state = 'main'
            updateByAnimation(radius, color, vx, vy, isAlive)(obj)(animation)
            return
        case 'fade-in':
            return
        case 'main':
            {
                const circle = <PIXI.Graphics>obj.elements.circle
                const time   = PixiObject.getTime(obj, animation)
                let c = Color.default(color)
                c = c.saturationl(c.saturationl() * (Math.sin(0.003  * Math.PI * time) * 0.2 + 0.8))
                c = c.lightness  (c.lightness  () * (Math.sin(0.0025 * Math.PI * time) * 0.3 + 0.3))
                circle.clear()
                circle.beginFill(c.rgbNumber())
                      .drawCircle(0.0, 0.0, radius)
                      .endFill()
                circle.x += vx * animation.progress
                circle.y += vy * animation.progress
                if (!isAlive(obj.elements.circle.x, obj.elements.circle.y)) {
                    obj.state = 'terminate'
                }
                return
            }
        case 'fade-out':
            return
        case 'terminate':
            return
        default:
            throw 'Invalid state'
    }
}
