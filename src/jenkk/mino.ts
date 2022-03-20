
enum MinoType {
    empty = "E",
    S = "S",
    Z = "Z",
    J = "J",
    L = "L",
    O = "O",
    I = "I",
    T = "T",
    ghost = "GH",
    garbage = "GA"
}

class Mino {
    constructor(public type: MinoType = MinoType.empty) { }
}

export { Mino, MinoType }