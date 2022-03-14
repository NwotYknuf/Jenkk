import { MinoType } from "../mino";
import { MinoPosition, Piece, RotationState } from "../piece";

class PieceBuilder {

    private _prototype: MinoType | undefined;
    private _centerShift: number = 0.5;
    private _rotationState = RotationState.flat;
    private _type: MinoType = MinoType.I;
    private _shape: MinoPosition[] = [{ x: -1.5, y: 0.5 }, { x: -0.5, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 1.5, y: 0.5 }];

    build() {
        if (this._prototype) {
            return PieceBuilder.buildFromTemplate(this._prototype);
        }
        return new Piece(this._centerShift, this._rotationState, this._type, this._shape);
    }

    public set centerShift(centerShift: number) {
        this._centerShift = centerShift;
    }

    public set rotationState(rotationState: RotationState) {
        this._rotationState = rotationState;
    }

    public set type(type: MinoType) {
        this._type = type;
    }

    public set shape(shape: MinoPosition[]) {
        this._shape = shape;
    }

    public loadJSON(json: any) {
        if ("prototype" in json) {
            this._prototype = MinoType[json.prototype as keyof typeof MinoType];
        }
    }

    public static buildFromTemplate(type: MinoType): Piece {
        switch (type) {
            case MinoType.I:
                return new Piece(0.5, RotationState.flat, MinoType.I, [{ x: -1.5, y: 0.5 }, { x: -0.5, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 1.5, y: 0.5 }]);
            case MinoType.J:
                return new Piece(0, RotationState.flat, MinoType.J, [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]);
            case MinoType.L:
                return new Piece(0, RotationState.flat, MinoType.L, [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }]);
            case MinoType.O:
                return new Piece(0.5, RotationState.flat, MinoType.O, [{ x: -0.5, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: -0.5, y: -0.5 }, { x: 0.5, y: -0.5 }]);
            case MinoType.S:
                return new Piece(0, RotationState.flat, MinoType.S, [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]);
            case MinoType.T:
                return new Piece(0, RotationState.flat, MinoType.T, [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }]);
            case MinoType.Z:
                return new Piece(0, RotationState.flat, MinoType.Z, [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }]);
        }
        throw new Error("Unknow mino type");
    }
}

export { PieceBuilder }