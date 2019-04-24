import '@/stylus/style.styl'
import * as Render  from '@/ts/render'
import * as Factory from '@/ts/factory'

window.onload = () => {
    const width  = window.innerWidth  - 20
    const height = window.innerHeight - 20

    const objs = Factory.createAll()

    Render.initRender(width, height, objs)
}
