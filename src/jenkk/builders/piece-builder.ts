import { MinoType } from "../mino";
import { Piece, RotationState } from "../piece";

class PieceBuilder {

    S() {
        return new Piece(0, RotationState.flat, MinoType.S, [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]);
    }

    Z() {
        return new Piece(0, RotationState.flat, MinoType.Z, [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }]);
    }

    J() {
        return new Piece(0, RotationState.flat, MinoType.J, [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]);
    }

    L() {
        return new Piece(0, RotationState.flat, MinoType.L, [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }]);
    }

    O() {
        return new Piece(0.5, RotationState.flat, MinoType.O, [{ x: -0.5, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: -0.5, y: -0.5 }, { x: 0.5, y: -0.5 }]);
    }

    I() {
        return new Piece(0.5, RotationState.flat, MinoType.I, [{ x: -1.5, y: 0.5 }, { x: -0.5, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 1.5, y: 0.5 }]);
    }

    T() {
        return new Piece(0, RotationState.flat, MinoType.T, [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }]);
    }
}

export { PieceBuilder }