import * as PIXI        from 'pixi.js'
import * as R           from 'ramda'
import * as Animation   from '../animation'
import * as Interaction from '../interaction'
import * as PixiState   from './pixistate'

export interface IPixiObject {
    elements: {
        [name: string]: PIXI.DisplayObject
    },
    pixiState          : PixiState.IPixiState
    parent             : PIXI.Container
    timestamp          : number
    state              : string
    updateByAnimation  : (obj: IPixiObject) => (animation  : Animation.IAnimationState) => void
    updateByInteraction: (obj: IPixiObject) => (interaction: Interaction.IInteraction ) => void
    updateByTime       : (obj: IPixiObject) => (time       : Date                     ) => void
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
                R.forEachObjIndexed(elem => obj.parent.removeChild(elem))(obj.elements)
            }
        ),
    )([...pixiState.objects])
}

export const getTime = (obj: IPixiObject, animation: Animation.IAnimationState) => {
    return animation.now - obj.timestamp
}
