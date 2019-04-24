import * as THREE  from 'three'
import * as Rx     from 'rx'
import * as Render from './render'

const possCount = 1000

export interface IInteract {
    poss   : THREE.Vector2[]
    button1: boolean
    button2: boolean
}

export const initInteract = (threeObjects: Render.IThree, width: number, height: number) => {
    const canvas = document.getElementById('container')!
                           .appendChild(threeObjects.renderer.domElement)
    
    const interact = {
        poss   : [],
        button1: false,
        button2: false
    }

    const mouseEvents: Rx.Observable<MouseEvent> = Rx.Observable.merge(
        <Rx.Observable<MouseEvent>>Rx.Observable.fromEvent(canvas, 'mouseup'  ),
        <Rx.Observable<MouseEvent>>Rx.Observable.fromEvent(canvas, 'mousedown'),
        <Rx.Observable<MouseEvent>>Rx.Observable.fromEvent(canvas, 'mousemove')
    )
    return mouseEvents.map(updateInteractions(interact, width, height))
                      .merge(Rx.Observable.of(interact))
}

const updateInteractions = (interact: IInteract, width: number, height: number) => (e: MouseEvent) => {
    while (interact.poss.length > possCount) {
        interact.poss.pop()
    }
    
    const conv = (offset: number, width: number) => offset / width * 2.0 - 1.0
    const pos = new THREE.Vector2(conv(e.offsetX, width), conv(e.offsetY, height))
    
    interact.poss.unshift(pos)
    interact.button1 = (e.buttons & 0x1) !== 0
    interact.button2 = (e.buttons & 0x2) !== 0

    return interact
}
