import * as PIXI        from 'pixi.js'
import * as Rx          from 'rxjs'
import * as RxOp        from 'rxjs/operators'
import * as R           from 'ramda'
import * as Animation   from '../animation'
import * as Interaction from '../interaction'
import * as PixiObject  from './pixiobject'
import * as MovingCircleObject from './movingcircleobject'
import * as Random      from '../utils/random'

export interface IPixiState {
    application  : PIXI.Application
    render       : (pixiState: IPixiState, animationState: Animation.IAnimationState) => Uint8Array | Uint8ClampedArray
    objects      : Set<PixiObject.IPixiObject>
    subscriptions: Rx.Subscription[]
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
        render,
        objects      : new Set(),
        subscriptions: []
    }

    application.stage.scale.set(1.0, -1.0)
    application.stage.pivot = new PIXI.Point(-width * 0.5, height * 0.5)

    pixiState.subscriptions.push(
        Rx.pipe(
            RxOp.map((a: Animation.IAnimationState) => Math.floor(a.total / 60.0)),
            RxOp.distinctUntilChanged()
        )(animations)
        .subscribe(_ => R.forEach(_ => {
            const circle = MovingCircleObject.create(
                -width * 0.8,
                (Random.next() - 0.5) * height,
                Random.next() * 10.0 + 4.0,
                Random.next() * 0xFFFFFF,
                pixiState,
                application.stage,
                Date.now(),
                Random.next() + 0.5, 0.0,
                (x, y) => x < pixiState.application.screen.width * 0.8
            )
            pixiState.objects.add(circle)
        })(R.range(1, 3)))
    )

    pixiState.subscriptions.push(
        animations.subscribe(_ => PixiObject.init(pixiState))
    )

    pixiState.subscriptions.push(
        animations.subscribe(a =>
            R.pipe(
                R.map((obj: PixiObject.IPixiObject) => obj.updateByAnimation(obj)),
                R.juxt
            )([...pixiState.objects])(a)
        )
    )

    pixiState.subscriptions.push(
        interactions.subscribe(ii =>
            R.forEach(
                R.pipe(
                    R.map((obj: PixiObject.IPixiObject) => obj.updateByInteraction(obj)),
                    R.juxt
                )([...pixiState.objects])
            )(ii)
        )
    )

    pixiState.subscriptions.push(
        times.subscribe(t =>
            R.pipe(
                R.map((obj: PixiObject.IPixiObject) => obj.updateByTime(obj)),
                R.juxt
            )([...pixiState.objects])(t)
        )
    )

    pixiState.subscriptions.push(
        animations.subscribe(_ =>PixiObject.terminate(pixiState))
    )

    application.ticker.add(tick(pixiState))

    return pixiState
}

export const resizeRenderer = (pixiState: IPixiState, width: number, height: number) => {
    pixiState.application.renderer.resize(width, height)
    pixiState.application.stage.pivot = new PIXI.Point(-width * 0.5, height * 0.5)
}

export const dispose = (pixiState: IPixiState) => {
    R.forEach((s: Rx.Subscription) => s.unsubscribe())(pixiState.subscriptions)
}

const render = (pixiState: IPixiState, animationState: Animation.IAnimationState) => {
    pixiState.application.ticker.update(animationState.total)
    return pixiState.application.renderer.extract.pixels()
}

const tick = (pixiState: IPixiState) => (dt: number) => {
    pixiState.application.render()
}
