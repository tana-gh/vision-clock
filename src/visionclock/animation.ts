import * as Rx   from 'rxjs'
import * as RxOp from 'rxjs/operators'

export interface IAnimationState {
    start   : number
    total   : number
    before  : number
    now     : number
    progress: number
}

export const create = (now: number): Rx.Observable<IAnimationState> => {
    const animations = Rx.interval(0, Rx.animationFrameScheduler)
    const start = now

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
