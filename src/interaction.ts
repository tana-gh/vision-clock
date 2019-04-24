import * as THREE from 'three'
import * as Rx    from 'rxjs'
import * as RxOp  from 'rxjs/operators'

export interface IInteraction {
    readonly position: THREE.Vector2 | undefined
    readonly movement: THREE.Vector2 | undefined
    readonly button1 : boolean
    readonly button2 : boolean
    readonly button3 : boolean
}

export const create = (targetElement: HTMLElement | Window, rootElement: HTMLElement | Window) => {
    const mouseEvents: Rx.Observable<MouseEvent> = Rx.merge(
        <Rx.Observable<MouseEvent>>Rx.fromEvent(rootElement, 'mousedown', { capture: true }),
        <Rx.Observable<MouseEvent>>Rx.fromEvent(rootElement, 'mousemove', { capture: true }),
        <Rx.Observable<MouseEvent>>Rx.fromEvent(rootElement, 'mouseup'  , { capture: true })
    )
    return Rx.pipe(
        RxOp.map(update(targetElement)),
        RxOp.merge(Rx.of(<IInteraction>{
            position: undefined,
            movement: undefined,
            button1 : false,
            button2 : false,
            button3 : false
        }))
    )(mouseEvents)
}

const update = (targetElement: HTMLElement | Window) => (e: MouseEvent) => {
    const [targetLeft, targetTop] = getScrollTopLeft(targetElement)
    const [x, y] = [e.clientX - targetLeft, e.clientY - targetTop]
    const height = targetElement instanceof HTMLElement ? targetElement.clientHeight : targetElement.innerHeight

    const position = new THREE.Vector2(x, height - y - 1)
    const movement = new THREE.Vector2(e.movementX, e.movementY)
    
    return <IInteraction>{
        position,
        movement,
        button1: (e.buttons & 0x1) !== 0,
        button2: (e.buttons & 0x2) !== 0,
        button3: (e.buttons & 0x4) !== 0,
    }
}

const getScrollTopLeft = (element: HTMLElement | Window) => {
    const documentElement = document.documentElement
    const pageXOffset = (window.pageXOffset || documentElement.scrollLeft) - (documentElement.clientLeft || 0)
    const pageYOffset = (window.pageYOffset || documentElement.scrollTop ) - (documentElement.clientTop  || 0)

    if (element instanceof HTMLElement) {
        return [
            element.offsetLeft + element.clientLeft - element.scrollLeft - pageXOffset,
            element.offsetTop  + element.clientTop  - element.scrollTop  - pageYOffset
        ]
    }
    else {
        return [
            -pageXOffset,
            -pageYOffset
        ]
    }
}
