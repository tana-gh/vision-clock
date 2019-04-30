
export const visionClockClass = 'visionclock'

export const clockParams = {
    radius          : 0.8,
    hourHandLength  : 0.25,
    hourHandWidth   : 0.025,
    hourHandHeight  : 0.005,
    minuteHandLength: 0.35,
    minuteHandWidth : 0.01,
    minuteHandHeight: 0.005,
    secondHandLength: 0.35,
    secondHandBack  : 0.05,
    secondHandWidth : 0.002,
    secondHandHeight: 0.002,
    scaleLength     : 0.1,
    scaleWidth      : 0.01,
    scaleHeight     : 0.01
}

export const clockMaterial = {
    color: 0xFFFFFF,
    metalness: 0.5,
    roughness: 0.5,
    clearCoat: 0.5,
    clearCoatRoughness: 0.5,
    reflectivity: 1.0,
    fog: true
}

export const clockScaleVertices = [
     'z', 'z',  'h',   'z', '-l',  'h',
     'w', 'z',  'z',   'w', '-l',  'z',
     'z', 'z', '-h',   'z', '-l', '-h',
    '-w', 'z',  'z',  '-w', '-l',  'z'
]

export const clockScaleIndices = [
    0, 1, 2,  1, 3, 2,
    2, 3, 4,  3, 5, 4,
    4, 5, 6,  5, 7, 6,
    6, 7, 0,  7, 1, 0,
    0, 2, 4,  4, 6, 0,
    1, 7, 5,  5, 3, 1
]

export const mapVertices = (
    length: number,
    back  : number,
    width : number,
    height: number
) => (placeholder: string) => {
    switch (placeholder) {
        case 'z':
            return 0.0
        case 'l':
            return length
        case '-l':
            return -length
        case 'b':
            return back
        case '-b':
            return -back
        case 'w':
            return width
        case '-w':
            return -width
        case 'h':
            return height
        case '-h':
            return -height
        default:
            return 0.0
    }
}
