import * as Rx   from 'rxjs'
import * as RxOp from 'rxjs/operators'
import * as C    from './utils/constants'

export const create = () => {
    return Rx.pipe(
        RxOp.map(_ => Date()),
        RxOp.distinctUntilChanged(),
        RxOp.map(s => new Date(s))
    )(Rx.timer(0, C.timerPeriod))
}
