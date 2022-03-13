import { Board } from './board'
import { BoardBuilder } from './builders/board-builder';
import { Mino, MinoType } from './mino';
import { Piece, RotationState } from './piece';
import { Position } from './position';

describe("Board", () => {

    let board: Board;

    beforeEach(() => {
        board = new BoardBuilder().build();
    });

    it("Can change minos", () => {
        board.setMino(0, 0, new Mino(MinoType.J));
        expect(board.minos[0][0]).toEqual({ type: MinoType.J });
    });

    it("Can detect empty boards", () => {
        expect(board.allClear()).toBe(true);
        board.setMino(0, 0, new Mino(MinoType.J));
        expect(board.allClear()).toBe(false);
    });

    it("Can create a copy", () => {
        let copy = board.clone();

        expect(board).toEqual(copy);

        copy.setMino(0, 0, new Mino(MinoType.J));
        //modifying the copy does not modify the original
        expect(board.minos[0][0]).toEqual({ type: MinoType.empty });
    });

    it("Can return a board with a piece and a ghost", () => {
        const piece = new Piece(0, RotationState.flat, MinoType.J, [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]);
        const piecePos = new Position(4, 10);
        const ghost = new Piece(0, RotationState.flat, MinoType.ghost, [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]);
        const ghostPos = new Position(4, 0);

        let boardWithPieceAndGhost = board.getBoardWithPiece(piece, piecePos, ghost, ghostPos);

        const expected = new BoardBuilder().build();
        expected.setMino(4, 10, new Mino(MinoType.J));
        expected.setMino(5, 10, new Mino(MinoType.J));
        expected.setMino(3, 11, new Mino(MinoType.J));
        expected.setMino(3, 10, new Mino(MinoType.J));

        expected.setMino(4, 0, new Mino(MinoType.ghost));
        expected.setMino(5, 0, new Mino(MinoType.ghost));
        expected.setMino(3, 1, new Mino(MinoType.ghost));
        expected.setMino(3, 0, new Mino(MinoType.ghost));

        expect(boardWithPieceAndGhost).toEqual(expected);
        //the board was not affected
        expect(board.allClear()).toBe(true);
    });

    it("Can detect a collision", () => {
        const piece = new Piece(0, RotationState.flat, MinoType.J, [{ x: 0, y: 0 }]);
        const piecePos = new Position(0, 0);

        expect(board.collision(piece, piecePos)).toBe(false);
        board.setMino(0, 0, new Mino(MinoType.J));
        expect(board.collision(piece, piecePos)).toBe(true);

        //piece out of bound
        piecePos.x = 20;
        expect(board.collision(piece, piecePos)).toBe(true);

        piecePos.x = -20;
        expect(board.collision(piece, piecePos)).toBe(true);

        piecePos.x = 0;
        piecePos.y = 30;

        expect(board.collision(piece, piecePos)).toBe(true);

        piecePos.y = -30;
        expect(board.collision(piece, piecePos)).toBe(true);

    });
})