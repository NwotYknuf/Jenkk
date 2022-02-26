import { Board } from "../board";
import { MinoType } from "../mino";
import { Piece, RotationState } from "../piece";
import { RotationFunction, RotationSystem } from "./rotation-system";

type Kick = { x: number, y: number };

type KickTable = Map<RotationState, Map<RotationState, Kick[]>>;

class SRS extends RotationSystem {

    constructor(private kickTable: KickTable, private IkickTable: KickTable) {
        super();
    }

    private rotate(board: Board, piece: Piece, nextRotation: RotationState, rotate: RotationFunction): [boolean, Piece] {
        let currentPiece = piece.clone();
        const oldPiece = piece.clone();

        const kickTable = currentPiece.type === MinoType.I ? this.IkickTable : this.kickTable;
        const currentRotation = currentPiece.rotation;
        const shifts = kickTable.get(currentRotation)?.get(nextRotation);

        if (!shifts) {
            throw new Error(`Missing kick table for ${currentRotation} ${nextRotation}`);
        }

        //try all SRS kicks
        for (let i = 0; i < shifts.length; i++) {
            rotate.call(currentPiece);
            currentPiece.x += shifts[i].x;
            currentPiece.y += shifts[i].y;
            if (!board.collision(currentPiece)) {
                return [true, currentPiece];
            }
            //reset the piece for next iteration
            currentPiece = oldPiece.clone();
        }

        return [false, oldPiece];
    }

    public rotateCCW(board: Board, piece: Piece): [boolean, Piece] {
        let nextRotation = (piece.rotation - 1);
        if (nextRotation < 0) {
            nextRotation += 4;
        }
        return this.rotate(board, piece, nextRotation, Piece.prototype.rotateCCW);
    }

    public rotateCW(board: Board, piece: Piece): [boolean, Piece] {
        const nextRotation = (piece.rotation + 1) % 4;
        return this.rotate(board, piece, nextRotation, piece.rotateCW);
    }

    public rotate180(board: Board, piece: Piece): [boolean, Piece] {
        const nextRotation = (piece.rotation + 2) % 4;
        return this.rotate(board, piece, nextRotation, piece.rotate180);
    }
}

export { SRS, type KickTable, type Kick }