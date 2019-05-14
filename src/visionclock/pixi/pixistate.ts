import * as PIXI        from 'pixi.js'
import * as Rx          from 'rxjs'
import * as RxOp        from 'rxjs/operators'
import * as R           from 'ramda'
import * as Color       from 'color'
import * as Animation   from '../animation'
import * as Interaction from '../interaction'
import * as PixiObject  from './pixiobject'
import * as MovingCircleObject from './movingcircleobject'
import * as Random      from '../utils/random'

export interface IPixiState {
    application: PIXI.Application
    objects    : Set<PixiObject.IPixiObject>
    render ?   : (animationState: Animation.IAnimationState) => Uint8Array | Uint8ClampedArray
    dispose?   : () => void
}

export const create = (
    width       : number,
    height      : number,
    animations  : Rx.Observable<Animation.IAnimationState>,
    interactions: Rx.Observable<Interaction.IInteraction[]>,
    times       : Rx.Observable<Date>
): IPixiState => {
    const application = new PIXI.Application({
        width,
        height,
        autoStart : false,
        antialias : true,
        preserveDrawingBuffer: true
    })
    
    const pixiState: IPixiState = {
        application,
        objects: new Set()
    }

    application.stage.scale.set(1.0, -1.0)
    application.stage.pivot = new PIXI.Point(-width * 0.5, height * 0.5)

    const subscriptions = [
        Rx.pipe(
            RxOp.map((a: Animation.IAnimationState) => Math.floor(a.total / 60.0)),
            RxOp.distinctUntilChanged()
        )(animations)
        .subscribe(_ => R.forEach(_ => {
            const circle = MovingCircleObject.create(
                -width * 0.8,
                (Random.next() - 0.5) * height,
                (Random.next() * 0.15 + 0.05) * height,
                Color.hsl(Random.next() * 360.0, 100.0, 99.0).rgbNumber(),
                PIXI.BLEND_MODES.ADD,
                pixiState,
                application.stage,
                Date.now(),
                Random.next() + 0.5,
                0.0,
                (x, y) => x < pixiState.application.screen.width * 0.8
            )
            pixiState.objects.add(circle)
        })(R.range(1, 3))),

        animations.subscribe(_ => PixiObject.init(pixiState)),

        animations.subscribe(a =>
            R.pipe(
                R.map((obj: PixiObject.IPixiObject) => obj.updateByAnimation!),
                R.juxt
            )([...pixiState.objects])(a)
        ),

        interactions.subscribe(ii =>
            R.forEach(
                R.pipe(
                    R.map((obj: PixiObject.IPixiObject) => obj.updateByInteraction!),
                    R.juxt
                )([...pixiState.objects])
            )(ii)
        ),

        times.subscribe(t =>
            R.pipe(
                R.map((obj: PixiObject.IPixiObject) => obj.updateByTime!),
                R.juxt
            )([...pixiState.objects])(t)
        ),

        animations.subscribe(_ =>PixiObject.terminate(pixiState))
    ]

    application.ticker.add(tick(pixiState))

    pixiState.render = render(pixiState)

    pixiState.dispose = () => {
        pixiState.application.destroy(true, true)
        R.forEach((s: Rx.Subscription) => s.unsubscribe())(subscriptions)
    }

    return pixiState
}

export const resizeRenderer = (pixiState: IPixiState, width: number, height: number) => {
    pixiState.application.renderer.resize(width, height)
    pixiState.application.stage.pivot = new PIXI.Point(-width * 0.5, height * 0.5)
}

const render = (pixiState: IPixiState) => (animationState: Animation.IAnimationState) => {
    pixiState.application.ticker.update(animationState.total)
    return pixiState.application.renderer.extract.pixels()
}

const tick = (pixiState: IPixiState) => (dt: number) => {
    pixiState.application.render()
}
