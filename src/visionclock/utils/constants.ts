
export const visionClockClass = 'visionclock'

export const timerPeriod = 10

export const orthographicParams = {
    near: -100.0,
    far :  100.0
}

export const perspectiveParams = {
    fov : 30.0,
    near: 0.1,
    far : 100.0,
    z   : 5.0
}

export const fogColor = 0x000000

export const clockParams = {
    radius          : 0.8,
    hourHandLength  : 0.5,
    hourHandWidth   : 0.03,
    hourHandHeight  : 0.02,
    minuteHandLength: 0.75,
    minuteHandWidth : 0.02,
    minuteHandHeight: 0.01,
    secondHandLength: 0.9,
    secondHandWidth : 0.01,
    secondHandHeight: 0.01,
    secondHandBack  : 0.15,
    scaleLength     : 0.12,
    scaleWidth      : 0.006,
    scaleHeight     : 0.005,
    baseScaleGap    : 0.02,
    frameRadius     : 1.0,
    frameZ          : -0.2,
    frameSegments   : 60,
    frameOpacity    : 0.85
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

export const clockHandVertices = [
     '0', '-b', 'h',  '0',  'l'  ,  'z',
    '-w', '-b', 'z',  '0', '-w-b',  'z',
     'w', '-b', 'z',  '0', '-b'  , '-h'
]

export const clockHandIndices = [
    0, 1, 2,  0, 2, 3,
    0, 3, 4,  0, 4, 1,
    5, 2, 1,  5, 3, 2,
    5, 4, 3,  5, 1, 4
]

export const clockScaleVertices = [
     '0', '0',  'h',   '0', '-l',  'h',
     'w', '0',  'z',   'w', '-l',  'z',
     '0', '0', '-h',   '0', '-l', '-h',
    '-w', '0',  'z',  '-w', '-l',  'z'
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
    width : number,
    height: number,
    z     : number,
    back  : number
) => (placeholder: string) => {
    switch (placeholder) {
        case '0':
            return 0.0
        case 'l':
            return length - back
        case '-l':
            return -length - back
        case 'w':
            return width
        case '-w':
            return -width
        case '-w-b':
            return -width - back
        case 'h':
            return z + height
        case '-h':
            return z - height
        case 'z':
            return z
        case '-b':
            return -back
        default:
            return 0.0
    }
}

export const clockRotationAngle = 2.0 * Math.PI / 24.0

export const lightParams = [
    { color: 0xFFFFFF, x:  1.0, y:  1.0, z: 0.5 },
    { color: 0xFFCC88, x:  1.5, y:  1.5, z: 3.0 },
    { color: 0x884444, x: -4.0, y: -4.0, z: 0.0 },
    { color: 0x888844, x:  0.0, y: -3.0, z: 0.5 },
    { color: 0xCCCCCC, x:  0.0, y:  2.0, z: 0.0 }
]

export const shaderObjectVertices = [
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0,
     0.5,  0.5, 0.0,
    -0.5,  0.5, 0.0
]

export const shaderObjectIndices = [
    0, 1, 2,
    0, 2, 3
]

export const shaderObjectParams = {
    a_coord: [
        -1.0, -1.0, 0.0, 1.0,
         1.0, -1.0, 0.0, 1.0,
         1.0,  1.0, 0.0, 1.0,
        -1.0,  1.0, 0.0, 1.0
    ],
    a_coordDim: 4
}

export const framePerMillisecond = 60.0 * 0.001

export const movingCircleGeneratorParams = {
    u_rinner  : 0.8,
    u_router  : 1.0,
    limitWidth: 0.8,
    maxSpeed  : 0.003,
    minSpeed  : 0.001,
    maxRadius : 0.4,
    minRadius : 0.1,
    sAngular  : 0.0015,
    sAmp      : 0.2,
    sScalar   : 0.8,
    lAngular  : 0.001,
    lAmp      : 0.3,
    lScalar   : 0.3
}
