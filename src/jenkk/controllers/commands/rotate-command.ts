import { MinoType } from "../../mino";
import { Piece, PieceSnapshot } from "../../piece";
import { Position, PositionSnapshot } from "../../position";
import { RotationType } from "../../rotationSystems/rotation-system";
import { Game } from "../game";
import { Command } from "./command";

class RotateCommand extends Command {

    private pieceSnapshot: PieceSnapshot | undefined;
    private positionSnapshot: PositionSnapshot | undefined;

    constructor(game: Game, private rotationType: RotationType) {
        super(game);
    }

    execute(): boolean {
        this.pieceSnapshot = this.game.currentPiece?.save();
        this.positionSnapshot = this.game.currentPiecePosition.save();
        return this.game.rotate(this.rotationType);
    }

    undo(): void {
        if (this.pieceSnapshot) {
            const piece = new Piece(0, 0, MinoType.empty, []);
            piece.restore(this.pieceSnapshot);
            this.game.currentPiece = piece;
        }
        if (this.positionSnapshot) {
            const pos = new Position(0, 0);
            pos.restore(this.positionSnapshot);
            this.game.currentPiecePosition = pos;
        }
    }

}

export { RotateCommand }