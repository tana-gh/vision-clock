import * as Rx        from 'rxjs'
import * as RxOp      from 'rxjs/operators'
import * as Animation from './animation'
import * as C         from './utils/constants'

export const create = (animations: Rx.Observable<Animation.IAnimationState>) => {
    return Rx.pipe(
        RxOp.map(_ => Date()),
        RxOp.distinctUntilChanged(),
        RxOp.map(s => new Date(s))
    )(animations)
}
