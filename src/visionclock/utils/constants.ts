
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
) => (placeholder: string): number => {
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

export const bgGeneratorParams = {
    u_radius  : 10.0,
    u_arcy    : -0.5,
    u_powinner: 1000.0,
    u_powouter: 200.0,
    u_white   : [0.4, 0.4, 0.4, 1.0],
    colorFreq : 10000.0
}

export const bgObjectParams = {
    bgLightness: 0.4,
    arcHue     : -0.2
}

export const movingCircleGeneratorParams = {
    u_rinner  : 0.8,
    u_router  : 1.0,
    createFreq: 0.06,
    yPosPow   : 3.0,
    yPosMax   : 0.3,
    xMaxSpeed : 0.0004,
    xMinSpeed : 0.0001,
    yMaxSpeed : 0.00004,
    yMinSpeed : 0.00002,
    yAngular  : 0.1,
    radiusPow : 2.0,
    maxRadius : 0.25,
    minRadius : 0.05,
    sAngular  : 0.2,
    sAmp      : 0.1,
    sScalar   : 0.3,
    lAngular  : 0.6,
    lAmp      : 0.25,
    lScalar   : 0.3
}

export const snowGeneratorParams = {
    u_rinner  : 0.8,
    u_router  : 1.0,
    createFreq: 0.2,
    xMaxSpeed : 0.00002,
    xMinSpeed : 0.00001,
    yMaxSpeed : 0.0003,
    yMinSpeed : 0.0001,
    yAngular  : 0.1,
    radiusPow : 2.0,
    maxRadius : 0.03,
    minRadius : 0.01,
    lightness : 0.6
}

export const movingObjectParams = {
    fadeInTime : 1000.0,
    fadeOutTime: 2000.0
}

export const forestGeneratorParams = {
    u_rinner: 0.4,
    u_router: 1.0,
    velocity: 0.025,
    objCount: 15,
    depth   : 4,
    interval: 5000.0
}

export const treeGeneratorParams = {
    createFreq  : 1.0,
    maxRadius   : 0.025,
    minRadius   : 0.01,
    objVelocity : 0.003,
    hslLightness: 0.6,
    lightness   : 0.8,
    noise       : 0.0015,
    subTreeCount: 4,
    subTreeRollX: Math.PI * 0.2
}

export const treeObjectParams = {
    fadeInTime : 1000.0,
    fadeOutTime: 1000.0
}
