
const resizeContainer = () => {
    const container = document.getElementById('container')
    container.style.width  = `${window.innerWidth }px`
    container.style.height = `${window.innerHeight}px`
}

window.addEventListener('load', () => {
    resizeContainer()

    WebFont.load({
        google: {
            families: [
                'Noto Sans',
                'Noto Sans JP'
            ]
        }
    })
})

window.addEventListener('resize', () => {
    resizeContainer()
})