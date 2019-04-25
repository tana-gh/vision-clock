import * as THREE from 'three'
import * as Rx    from 'rxjs'
import * as RxOp  from 'rxjs/operators'

export interface IInteraction {
    readonly position: THREE.Vector3
    readonly movement: THREE.Vector3
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
    return RxOp.map(update(targetElement))(mouseEvents)
}

const update = (targetElement: HTMLElement | Window) => (e: MouseEvent) => {
    const [targetLeft, targetTop] = getScrollTopLeft(targetElement)
    const [x, y] = [e.clientX - targetLeft, e.clientY - targetTop]
    const height = targetElement instanceof HTMLElement ? targetElement.clientHeight : targetElement.innerHeight

    const position = new THREE.Vector3(x, 1.0 + y - height, 0.0).divideScalar(height)
    const movement = new THREE.Vector3(e.movementX, -e.movementY, 0.0).divideScalar(height)
    
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
