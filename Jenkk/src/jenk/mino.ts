
enum MinoType {
    empty,
    S, Z, J, L, O, I, T,
    ghost
}

class Mino {
    constructor(public type: MinoType = MinoType.empty) { }
}

export { Mino, MinoType }