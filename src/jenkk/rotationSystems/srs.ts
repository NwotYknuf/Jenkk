import { Game } from "../controllers/game";
import { MinoType } from "../mino";
import { Piece, RotationState } from "../piece";
import { RotationSystem, RotationType } from "./rotation-system";

type Kick = { x: number, y: number };
type KickTable = Map<RotationState, Map<RotationState, Kick[]>>;
type RotationFunction = () => void;

class SRS extends RotationSystem {

    private rotationFunctions: Map<RotationType, RotationFunction>;

    constructor(private kickTable: KickTable, private IkickTable: KickTable) {
        super();

        this.rotationFunctions = new Map<RotationType, RotationFunction>([
            [RotationType.CCW, Piece.prototype.rotateCCW],
            [RotationType.CW, Piece.prototype.rotateCW],
            [RotationType._180, Piece.prototype.rotate180]
        ]);
    }

    public rotate(game: Game, rotation: RotationType): boolean {

        if (!game.currentPiece) {
            throw new Error("Called rotate without a current piece");
        }

        const pos = game.currentPiecePosition.clone();
        const piece = game.currentPiece.clone();
        const posSnapshot = pos.save();

        const rotationFunction = this.rotationFunctions.get(rotation);

        if (!rotationFunction) {
            throw new Error(`No rotation function found`);
        }

        const currentRotation = piece.rotation;
        rotationFunction.call(piece);
        const nextRotation = piece.rotation;
        const kickTable = piece.type === MinoType.I ? this.IkickTable : this.kickTable;
        const shifts = kickTable.get(currentRotation)?.get(nextRotation);

        if (!shifts) {
            throw new Error(`Missing kick table for ${currentRotation} ${nextRotation}`);
        }

        //try all SRS kicks
        for (let i = 0; i < shifts.length; i++) {
            pos.x += shifts[i].x;
            pos.y += shifts[i].y;
            if (!game.board.collision(piece, pos)) {
                game.currentPiece = piece;
                game.currentPiecePosition = pos;
                return true;
            }
            //reset the piece for next iteration
            pos.restore(posSnapshot);
        }

        return false;
    }

}

export { SRS, type KickTable, type Kick }