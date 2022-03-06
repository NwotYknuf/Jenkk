import { GeneratorSnapshot } from "../../generators/generator";
import { PieceSnapshot } from "../../piece";
import { Game } from "../game";
import { Command } from "./command";

class HoldCommand extends Command {

    public currentPieceSnapshot: PieceSnapshot | undefined;
    public heldPieceSnapshot: PieceSnapshot | undefined;
    public generatorSnapshot: GeneratorSnapshot | undefined;

    constructor(game: Game) {
        super(game);
    }

    execute(): boolean {
        this.currentPieceSnapshot = this.game.currentPiece?.save();
        this.heldPieceSnapshot = this.game.heldPiece?.save();
        this.generatorSnapshot = this.game.generator.save();
        this.game.hold();
        return true;
    }
    undo(): void {
        if (this.heldPieceSnapshot) {
            const piece = this.game.heldPiece;
            piece?.restore(this.heldPieceSnapshot);
        }
        else {
            this.game.heldPiece = undefined;
        }
        if (this.currentPieceSnapshot) {
            const piece = this.game.currentPiece;
            piece?.restore(this.currentPieceSnapshot);
        }
        if (this.generatorSnapshot) {
            const gen = this.game.generator;
            gen.restore(this.generatorSnapshot);
            this.game.generator = gen;
        }
    }

}

export { HoldCommand }