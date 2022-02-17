import { Board, } from "./board";
import { Piece } from "./piece";
import { Generator } from './generators/generator';

/* Defines the state of the game */

class GameState {

    public currentPiece: Piece | undefined;
    public heldPiece: Piece | undefined;

    constructor(public board: Board, public generator: Generator, currentPiece?: Piece, heldPiece?: Piece) {
        this.currentPiece = currentPiece;
        this.heldPiece = heldPiece;
    }

    public clone(): GameState {
        return new GameState(this.board.clone(), this.generator.clone(), this.currentPiece?.clone(), this.heldPiece?.clone())
    }

}

export { GameState }