import * as Rx        from 'rxjs'
import * as RxOp      from 'rxjs/operators'
import * as Animation from './animation'

export const create = (animations: Rx.Observable<Animation.IAnimationState>): Rx.Observable<Date> => {
    return Rx.pipe(
        RxOp.map(_ => Date()),
        RxOp.distinctUntilChanged(),
        RxOp.map(s => new Date(s))
    )(animations)
}
