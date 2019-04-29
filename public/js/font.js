
const setContainerSize = () => {
    const container = document.getElementById('container')
    container.style.width  = `${window.innerWidth }px`
    container.style.height = `${window.innerHeight}px`
}

window.addEventListener('load', () => {
    setContainerSize()

    WebFont.load({
        google: {
            families: [
                'Noto Sans',
                'Noto Sans JP'
            ]
        }
    })
})

window.addEventListener('resize', setContainerSize)
