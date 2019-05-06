import * as Rx          from 'rxjs'
import * as RxOp        from 'rxjs/operators'

export interface IAnimationState {
    start   : number
    total   : number
    before  : number
    now     : number
    progress: number
}

export const create = () => {
    const animations = Rx.merge(
        Rx.of(0),
        RxOp.repeat()(
            Rx.of(0, Rx.animationFrameScheduler)
        )
    )
    const start = Date.now()

    return Rx.pipe(
        RxOp.map(_ => Date.now()),
        RxOp.pairwise(),
        RxOp.map(animate(start))
    )(animations)
}

const animate = (start: number) =>
([before, now]: [number, number]): IAnimationState => {
    return {
        start,
        total: now - start,
        before,
        now,
        progress: now - before 
    }
}
