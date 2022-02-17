import { Board } from './board'
import { Mino, MinoType } from './mino';
import { Piece, RotationState } from './piece';

describe("Board", () => {

    let board: Board;

    beforeEach(() => {
        board = new Board();
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

    it("Can export to and load from a valid json string", () => {
        let str = board.export();
        let loadedBoard = JSON.parse(str) as Board;
        expect(loadedBoard.length).toBe(board.length);
        expect(loadedBoard.height).toBe(board.height);
        expect(loadedBoard.minos).toEqual(board.minos);
    });

    it("Can return a board with a piece and a ghost", () => {
        const piece = new Piece(4, 10, 0, RotationState.flat, MinoType.J, [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]);
        const ghost = new Piece(4, 0, 0, RotationState.flat, MinoType.J, [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]);

        let boardWithPieceAndGhost = board.getBoardWithPiece(piece, ghost);

        expect(boardWithPieceAndGhost.length).toBe(board.length);
        expect(boardWithPieceAndGhost.height).toBe(board.height);
        expect(boardWithPieceAndGhost.minos).toEqual([
            [
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 },
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }
            ],
            [
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 },
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }
            ],
            [
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 },
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }
            ],
            [
                { type: 3 }, { type: 3 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 },
                { type: 3 }, { type: 3 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }
            ],
            [
                { type: 3 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 },
                { type: 3 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }
            ],
            [
                { type: 3 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 },
                { type: 3 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }
            ],
            [
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 },
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }
            ],
            [
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 },
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }
            ],
            [
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 },
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }
            ],
            [
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 },
                { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }, { type: 0 }
            ]
        ]);
        //the board was not affected
        expect(board.allClear()).toBe(true);
    });

    it("Can detect a collision", () => {
        const piece = new Piece(0, 0, 0, RotationState.flat, MinoType.J, [{ x: 0, y: 0 }]);

        expect(board.collision(piece)).toBe(false);
        board.setMino(0, 0, new Mino(MinoType.J));
        expect(board.collision(piece)).toBe(true);

        //piece out of bound
        piece.x = 20;
        expect(board.collision(piece)).toBe(true);

        piece.x = -20;
        expect(board.collision(piece)).toBe(true);

        piece.x = 0;
        piece.y = 30;
        expect(board.collision(piece)).toBe(true);

        piece.y = -30;
        expect(board.collision(piece)).toBe(true);

    });
})