
export interface IRandom {
    seed: number
    next: () => number
}

export const create = (seed: number): IRandom => {
    return {
        seed,
        next() {
            return next(this)
        }
    }
}

const next = (random: IRandom) => {
    let value = random.seed
    value ^= value << 13
    value ^= value >> 17
    value ^= value << 15
    random.seed = value
    return value / (1 << 31) * 0.5 + 0.5
}
