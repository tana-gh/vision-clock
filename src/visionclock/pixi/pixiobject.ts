import * as PIXI        from 'pixi.js'
import * as R           from 'ramda'
import * as Animation   from '../animation'
import * as Interaction from '../interaction'
import * as PixiState   from './pixistate'

export interface IPixiObject {
    elements: {
        [name: string]: PIXI.DisplayObject
    },
    filters: {
        [name: string]: PIXI.Filter<any>
    },
    pixiState           : PixiState.IPixiState
    parent              : PIXI.Container
    timestamp           : number
    state               : string
    updateByAnimation  ?: (animation  : Animation.IAnimationState) => void
    updateByInteraction?: (interaction: Interaction.IInteraction ) => void
    updateByTime       ?: (time       : Date                     ) => void
    dispose            ?: () => void
}

export const init = (pixiState: PixiState.IPixiState) => {
    R.pipe(
        objs => R.filter((obj: IPixiObject) => obj.state === 'init')(objs),
        R.forEach((obj: IPixiObject) =>
            obj.parent.addChild(...R.values(obj.elements))
        )
    )([...pixiState.objects])
}

export const terminate = (pixiState: PixiState.IPixiState) => {
    R.pipe(
        objs => R.filter((obj: IPixiObject) => obj.state === 'terminate')(objs),
        R.forEach((obj: IPixiObject) => {
                pixiState.objects.delete(obj)
                R.forEachObjIndexed((elem: PIXI.DisplayObject) => {
                    obj.parent.removeChild(elem);
                    elem.destroy()
                })(obj.elements)
            }
        ),
    )([...pixiState.objects])
}

export const getTime = (obj: IPixiObject, animation: Animation.IAnimationState) => {
    return animation.now - obj.timestamp
}
