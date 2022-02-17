import { Board } from "./board";
import { GameState } from "./gameState";
import { Generator } from "./generators/generator";
import { SequenceGenerator } from "./generators/sequenceGenerator";
import { MinoType } from "./mino";
import { Piece, RotationState } from "./piece";

describe("GameState", () => {

    const first = new Piece(0, 0, 0, RotationState.flat, MinoType.J, [{ x: 0, y: 0 }]);
    const second = new Piece(0, 0, 0, RotationState.flat, MinoType.L, [{ x: 1, y: 1 }]);
    const third = new Piece(0, 0, 0, RotationState.flat, MinoType.O, [{ x: 2, y: 2 }]);

    const queue = [first, second, third];

    let gameState: GameState;

    beforeEach(() => {
        gameState = new GameState(new Board(10, 20), new SequenceGenerator(3, 3, 2, Generator.cloneQueue(queue)));
    })

    it("Can copy itself", () => {
        let copy = gameState.clone();
        expect(copy).toEqual(gameState);

        const current = new Piece(0, 0, 0, RotationState.flat, MinoType.I, [{ x: 7, y: 7 }]);
        const held = new Piece(0, 0, 0, RotationState.flat, MinoType.O, [{ x: 4, y: 4 }]);

        gameState.currentPiece = current;
        gameState.heldPiece = held;

        copy = gameState.clone();
        expect(copy).toEqual(gameState);

    });

});