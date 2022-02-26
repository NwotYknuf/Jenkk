import { Board, } from "./board";
import { Piece } from "./piece";
import { Generator } from './generators/generator';

/* Defines the state of the game */

class GameState {

    constructor(public board: Board, public generator: Generator, public currentPiece?: Piece | undefined, public heldPiece?: Piece | undefined) { }

    public clone(): GameState {
        return new GameState(this.board.clone(), this.generator.clone(), this.currentPiece?.clone(), this.heldPiece?.clone())
    }

}

export { GameState }