import * as THREE     from 'three'
import * as Rx        from 'rxjs'
import * as RxOp      from 'rxjs/operators'
import * as Animation from './animation'

export interface IInteraction {
    readonly position: THREE.Vector3
    readonly movement: THREE.Vector3
    readonly button1 : boolean
    readonly button2 : boolean
    readonly button3 : boolean
}

export const create = (
    animations   : Rx.Observable<Animation.IAnimationState>,
    targetElement: HTMLElement | Window,
    rootElement  : HTMLElement | Window
) => {
    const mouseEvents = Rx.merge(
        <Rx.Observable<MouseEvent>>Rx.fromEvent(rootElement, 'mousedown', { capture: true }),
        <Rx.Observable<MouseEvent>>Rx.fromEvent(rootElement, 'mousemove', { capture: true }),
        <Rx.Observable<MouseEvent>>Rx.fromEvent(rootElement, 'mouseup'  , { capture: true })
    )
    const touchEvents = Rx.merge(
        Rx.of(undefined),
        <Rx.Observable<TouchEvent>>Rx.fromEvent(rootElement, 'touchstart' , { capture: true }),
        <Rx.Observable<TouchEvent>>Rx.fromEvent(rootElement, 'touchmove'  , { capture: true }),
        <Rx.Observable<TouchEvent>>Rx.fromEvent(rootElement, 'touchend'   , { capture: true }),
        <Rx.Observable<TouchEvent>>Rx.fromEvent(rootElement, 'touchcancel', { capture: true })
    )
    
    const mouseInteractions = RxOp.map(getInteractionFromMouseEvent(targetElement))(mouseEvents)
    const touchInteractions = <Rx.Observable<IInteraction>>Rx.pipe(
        RxOp.pairwise<TouchEvent | undefined>(),
        RxOp.map(getInteractionFromTouchEvent(targetElement)),
        RxOp.filter(i => i !== undefined),
    )(touchEvents)

    return Rx.merge(mouseInteractions, touchInteractions)
}

const getInteractionFromMouseEvent = (targetElement: HTMLElement | Window) => (e: MouseEvent) => {
    const [position, movement] = getPosition(targetElement, e.clientX, e.clientY, e.movementX, e.movementY)

    return <IInteraction>{
        position,
        movement,
        button1: (e.buttons & 0x1) !== 0,
        button2: (e.buttons & 0x2) !== 0,
        button3: (e.buttons & 0x4) !== 0
    }
}

const getInteractionFromTouchEvent = (targetElement: HTMLElement | Window) => ([prev, curr]: [TouchEvent | undefined, TouchEvent | undefined]) => {
    const [moveX, moveY] = prev !== undefined &&
                           curr!.touches[0] !== undefined &&
                           prev .touches[0] !== undefined &&
                           curr!.touches[0].identifier === prev.touches[0].identifier ?
                           [curr!.touches[0].clientX - prev.touches[0].clientX, curr!.touches[0].clientY - prev.touches[0].clientY] :
                           [0.0, 0.0]
    const [position, movement] = curr!.touches[0] !== undefined ?
                                 getPosition(targetElement, curr!.touches[0].clientX, curr!.touches[0].clientY, moveX, moveY) :
                                 prev !== undefined && prev.touches[0] !== undefined ?
                                 getPosition(targetElement, prev .touches[0].clientX, prev .touches[0].clientY, moveX, moveY) :
                                 [undefined, undefined]

    if (position === undefined) {
        return undefined
    }
    
    return <IInteraction>{
        position,
        movement,
        button1: curr!.touches[0] !== undefined,
        button2: false,
        button3: false
    }
}

const getPosition = (targetElement: HTMLElement | Window, clientX: number, clientY: number, moveX: number, moveY: number) => {
    const [targetLeft, targetTop] = getScrollTopLeft(targetElement)
    const [x, y] = [clientX - targetLeft, clientY - targetTop]
    const [width, height] = targetElement instanceof HTMLElement ?
                            [targetElement.clientWidth, targetElement.clientHeight] :
                            [targetElement.innerWidth , targetElement.innerHeight ]

    const position = new THREE.Vector3(x - width * 0.5, height * 0.5 - y - 1.0, 0.0).divideScalar(height)
    const movement = new THREE.Vector3(moveX, -moveY, 0.0).divideScalar(height)

    return [position, movement]
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
