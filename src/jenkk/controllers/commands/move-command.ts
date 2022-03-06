import { Position, PositionSnapshot } from "../../position";
import { Game } from "../game"
import { Command } from "./command"

class MoveCommand extends Command {

    private positionSnapshot: PositionSnapshot | undefined;

    constructor(game: Game, private x: number, private y: number) {
        super(game);
    }

    execute(): boolean {
        this.positionSnapshot = this.game.currentPiecePosition.save();
        return this.game.movePiece(this.x, this.y);
    }

    undo(): void {
        if (this.positionSnapshot) {
            const pos = new Position(0, 0);
            pos.restore(this.positionSnapshot);
            this.game.currentPiecePosition = pos;
        }
    }

}

export { MoveCommand }