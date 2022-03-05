import { GameBuilder } from "../builders/game-builder";
import { PieceBuilder } from "../builders/piece-builder";
import { Mino, MinoType } from "../mino";
import { Piece, RotationState } from "../piece";
import { Position } from "../position";
import { RotationType } from "../rotationSystems/rotation-system";
import { Game } from "./game";


describe("Game", () => {

    let game: Game;

    beforeEach(() => {
        game = new GameBuilder().test();
    });

    it("Refills the queue", () => {
        game.refillQueue();
        expect(game.queue).toEqual([
            new PieceBuilder().J(),
            new PieceBuilder().I(),
            new PieceBuilder().T(),
            new PieceBuilder().S(),
            new PieceBuilder().L()
        ]);
    });

    it("Spawns a piece", () => {
        game.refillQueue();
        game.spawnPiece();
        expect(game.currentPiece).toEqual(new PieceBuilder().J());
    });

    it("Holds a piece", () => {
        game.refillQueue();
        game.spawnPiece();
        expect(game.heldPiece).toBe(undefined);
        game.hold();
        expect(game.heldPiece).toEqual(new PieceBuilder().J());
        expect(game.currentPiece).toEqual(new PieceBuilder().I());
        game.lockPiece();
        game.spawnPiece();
        expect(game.currentPiece).toEqual(new PieceBuilder().T());
        expect(game.heldPiece).toEqual(new PieceBuilder().J());
        game.hold();
        expect(game.currentPiece).toEqual(new PieceBuilder().J());
        expect(game.heldPiece).toEqual(new PieceBuilder().T());
        game.hold();
        expect(game.currentPiece).toEqual(new PieceBuilder().T());
        expect(game.heldPiece).toEqual(new PieceBuilder().J());
    });

    it("Rotates the piece", () => {
        game.refillQueue();
        game.spawnPiece();
        game.rotate(RotationType.CW);
        expect(game.currentPiece?.rotation).toBe(RotationState.right);
    });

    it("Moves the piece", () => {
        game.refillQueue();
        game.spawnPiece();
        expect(game.currentPiecePosition).toEqual(new Position(4, 17));
        let res = game.movePiece(-1, 0);
        expect(game.currentPiecePosition).toEqual(new Position(3, 17));
        expect(res).toBe(true);
        game.movePiece(-1, 0);
        game.movePiece(-1, 0);
        game.movePiece(-1, 0);
        res = game.movePiece(-1, 0);
        expect(game.currentPiecePosition).toEqual(new Position(1, 17));
        expect(res).toBe(false);
    });

    it("Locks the piece", () => {
        game.refillQueue();
        game.spawnPiece();
        while (game.movePiece(0, -1));

        const expected = game.board.clone();
        expected.minos[3][0] = new Mino(MinoType.J);
        expected.minos[4][0] = new Mino(MinoType.J);
        expected.minos[5][0] = new Mino(MinoType.J);
        expected.minos[3][1] = new Mino(MinoType.J);

        game.lockPiece();
        expect(game.board).toEqual(expected);
        game.spawnPiece();

        expect(game.currentPiecePosition).toEqual(new Position(4, 17));

    });

    it("Clears lines", () => {
        game.board.minos[0][0] = new Mino(MinoType.I);
        game.board.minos[1][0] = new Mino(MinoType.I);
        game.board.minos[2][0] = new Mino(MinoType.I);
        game.board.minos[3][0] = new Mino(MinoType.I);
        game.board.minos[4][0] = new Mino(MinoType.I);
        game.board.minos[5][0] = new Mino(MinoType.I);
        game.board.minos[6][0] = new Mino(MinoType.I);
        game.board.minos[7][0] = new Mino(MinoType.I);
        game.board.minos[8][0] = new Mino(MinoType.I);
        game.board.minos[9][0] = new Mino(MinoType.I);

        game.clearLines();
        expect(game.board.minos[0][0].type).toBe(MinoType.empty)
    });

    it("notifies observers", () => {
        const func = jest.fn();
        game.addBoardWatcher(func);
        game.addClearWatcher(func);
        game.addHeldWatcher(func);
        game.addQueueWatcher(func);
        game.refillQueue();
        game.spawnPiece();
        game.lockPiece();
        game.clearLines();
        game.hold();
        game.notifyObservers();
        expect(func).toBeCalledTimes(4);
    })

})
