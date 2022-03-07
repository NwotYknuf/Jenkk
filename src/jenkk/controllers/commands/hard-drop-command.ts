import { BoardSnapshot } from "../../board";
import { GeneratorSnapshot } from "../../generators/generator";
import { PieceSnapshot } from "../../piece";
import { Command } from "./command"

class HardDropCommand extends Command {

    private generatorSnapshot: GeneratorSnapshot | undefined;
    private boardSnapshot: BoardSnapshot | undefined;
    private currentPieceSnapshot: PieceSnapshot | undefined;

    execute(): boolean {
        this.generatorSnapshot = this.game.generator.save();
        this.boardSnapshot = this.game.board.save();
        this.currentPieceSnapshot = this.game.currentPiece?.save();

        while (this.game.movePiece(0, -1));
        this.game.lockPiece();
        this.game.clearLines();
        this.game.spawnPiece();
        this.game.refillQueue();
        return true;
    }

    undo(): void {
        if (this.generatorSnapshot) {
            const gen = this.game.generator;
            gen.restore(this.generatorSnapshot);
            this.game.generator = gen;
        }
        if (this.boardSnapshot) {
            const board = this.game.board;
            board.restore(this.boardSnapshot);
            this.game.board = board;
        }
        if (this.currentPieceSnapshot) {
            const piece = this.game.currentPiece;
            if (piece) {
                piece.restore(this.currentPieceSnapshot);
                this.game.currentPiece = piece;
                this.game.resetCurrentPiece();
            }
        }
    }
}

export { HardDropCommand }