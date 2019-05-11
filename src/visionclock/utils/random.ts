
export const set = (seed: number) => {
    window['visionClockSeed'] = seed
}

export const next = () => {
    let value = <number>(<any>window).visionClockSeed
    value ^= value << 13
    value ^= value >> 17
    value ^= value << 15
    set(value)
    return value / (1 << 31) * 0.5 + 0.5
}
