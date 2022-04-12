import { Position, PositionSnapshot } from "../position";
import { RotationSystem, RotationType } from "../rotationSystems/rotation-system";
import { Board, BoardSnapshot } from "../board";
import { Piece, PieceSnapshot, RotationState } from "../piece";
import { Mino, MinoType } from "../mino";
import { Generator, GeneratorSnapshot } from "../generators/generator";
import { CanReffil, canRefill } from "../generators/can-refill";
import { Memento } from "../Memento";
import { Snapshot } from "../snapshot";
import { PieceBuilder } from "../builders/piece-builder";
import { GeneratorBuilder } from "../builders/generator-builder";

enum MoveType {
    none,
    movement,
    rotation
}

class GameSnapshot implements Snapshot {
    public generator: GeneratorSnapshot;
    public board: BoardSnapshot;
    public currentPiece: PieceSnapshot | undefined;
    public heldPiece: PieceSnapshot | undefined;
    public currentPiecePosition: PositionSnapshot;

    constructor(
        generator: Generator, board: Board, currentPiece: Piece | undefined, heldPiece: Piece | undefined, currentPiecePosition: Position) {
        this.generator = generator.save();
        this.board = board.save();
        this.currentPiece = currentPiece?.save();
        this.heldPiece = heldPiece?.save();
        this.currentPiecePosition = currentPiecePosition.save();
    }

    public toJSON() {
        let currentPiece;
        if (this.currentPiece) {
            currentPiece = this.currentPiece.toJSON()
        }

        let heldPiece;
        if (this.heldPiece) {
            heldPiece = this.heldPiece.toJSON()
        }

        return {
            generator: this.generator.toJSON(),
            board: this.board.toJSON(),
            currentPiece,
            heldPiece
        }
    }
}

class Game implements Memento<GameSnapshot> {

    private _lastMove: MoveType = MoveType.none;
    private _tSpin: boolean = false;
    private _lastClear: number = 0;

    private _currentPiecePosition: Position = this._spawPosition;

    public constructor(
        private _generator: Generator, private _rotationSystem: RotationSystem,
        private _spawPosition: Position, private _nbPreviewPieces: number,
        private _board: Board, private _currentPiece: Piece | undefined,
        private _heldPiece: Piece | undefined) {
    }

    public get generator(): Generator {
        return this._generator;
    }

    public set generator(generator: Generator) {
        this._generator = generator;
    }

    public get board(): Board {
        return this._board;
    }

    public set board(board: Board) {
        this._board = board;
    }

    public get heldPiece(): Piece | undefined {
        return this._heldPiece
    }

    public set heldPiece(piece: Piece | undefined) {
        this._heldPiece = piece;
    }

    public get currentPiece(): Piece | undefined {
        return this._currentPiece;
    }

    public set currentPiece(piece: Piece | undefined) {
        this._currentPiece = piece;
    }

    public get nbPreviewPieces() {
        return this._nbPreviewPieces;
    }

    public set nbPreviewPieces(nbPreviewPieces: number) {
        this._nbPreviewPieces = nbPreviewPieces;
    }

    public get queue() {
        return this.generator.getPreview(this.nbPreviewPieces);
    }

    public get boardWithPiece(): Board {
        if (!this.currentPiece) {
            throw new Error("Called boardWithPiece with no current piece")
        }
        return this.board.getBoardWithPiece(this.currentPiece, this.currentPiecePosition);
    }

    public get currentPiecePosition(): Position {
        return this._currentPiecePosition
    }

    public set currentPiecePosition(pos: Position) {
        this._currentPiecePosition = pos;
    }

    public get tSpin(): boolean {
        return this._tSpin;
    }

    public get lastClear(): number {
        return this._lastClear;
    }

    public rotate(rotation: RotationType): boolean {
        if (!this.currentPiece) {
            throw new Error("Tried to call rotate without a current piece");
        }

        const rotated = this._rotationSystem.rotate(this, rotation);
        if (rotated) {
            this._lastMove = MoveType.rotation;
        }
        return rotated;
    }

    public movePiece(x: number, y: number): boolean {

        if (!this.currentPiece) {
            throw new Error("Tried to call move without a current piece");
        }

        const newPos = new Position(
            this.currentPiecePosition.x + x,
            this.currentPiecePosition.y + y
        )

        if (this.board.collision(this.currentPiece, newPos)) {
            return false;
        }
        this.currentPiecePosition = newPos;
        this._lastMove = MoveType.movement;
        return true;

    }

    public spawnPiece(): void {
        this.currentPiece = this.generator.spawnPiece();
        this.currentPiecePosition = this._spawPosition.clone();
    }

    public resetCurrentPiece(): void {

        this.currentPiecePosition = this._spawPosition.clone();

        if (!this.currentPiece) {
            throw new Error("Tried to call resetCurrentPiece when current piece is undefined");
        }

        if (this.currentPiece.rotation === RotationState.right) {
            this.currentPiece.rotateCCW();
        }
        if (this.currentPiece.rotation === RotationState.left) {
            this.currentPiece.rotateCW();
        }
        if (this.currentPiece.rotation === RotationState.fliped) {
            this.currentPiece.rotate180();
        }
    }

    public hold(): void {

        if (this.currentPiece) {
            this.resetCurrentPiece();
        }

        let temp = this.currentPiece;

        if (!this.heldPiece) {
            this.spawnPiece();
            this.heldPiece = temp;
        }
        else {
            this.currentPiece = this.heldPiece;
            this.heldPiece = temp;
        }
    }

    public lockPiece(): void {
        //check for tspin
        this._tSpin = false;
        if (this.currentPiece?.type === MinoType.T && this._lastMove === MoveType.rotation) {
            const corners = [{ x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: -1 }, { x: 1, y: -1 }];
            let occupiedCorners = 0;
            corners.forEach((corner) => {
                if (!this.currentPiece) {
                    return;
                }
                const x = this.currentPiecePosition.x + corner.x;
                const y = this.currentPiecePosition.y + corner.y;
                if (this.board.occupied(x, y)) {
                    occupiedCorners += 1;
                }
            });
            this._tSpin = occupiedCorners > 2;
        }

        this.board = this.boardWithPiece;
    }

    public clearLines(): void {

        let clearedLines = 0;

        for (let y = this.board.height - 1; y >= 0; y--) {
            let lineFull = true;
            for (let x = 0; x < this.board.width; x++) {
                if (this.board.minos[x][y].type === MinoType.empty) {
                    lineFull = false;
                    break;
                }
            }

            if (lineFull) {
                clearedLines++;
                //pop the line and push a new line on top
                for (let x = 0; x < this.board.width; x++) {
                    this.board.minos[x].splice(y, 1);
                    this.board.minos[x].push(new Mino());
                }
            }
        }

        this._lastClear = clearedLines;
    }

    public refillQueue(): void {
        if (canRefill(this.generator)) {
            const gen = this.generator as unknown as CanReffil;
            if (gen.shouldRefill(this.nbPreviewPieces)) {
                gen.refill();
            }
        }
    }

    save(): GameSnapshot {
        return new GameSnapshot(this.generator, this.board, this.currentPiece, this.heldPiece, this.currentPiecePosition);
    }

    restore(snapshot: GameSnapshot): void {

        const generatorBuilder = new GeneratorBuilder();
        generatorBuilder.loadJSON(snapshot.generator.toJSON());
        this.generator = generatorBuilder.build();
        this.generator.restore(snapshot.generator);

        const board = this.board;
        board.restore(snapshot.board);
        this.board = board;

        if (snapshot.currentPiece) {
            if (this.currentPiece) {
                const piece = this.currentPiece;
                piece.restore(snapshot.currentPiece);
                this.currentPiece = piece;
            }
            else {
                this.currentPiece = new PieceBuilder().build();
                this.currentPiece.restore(snapshot.currentPiece);
            }
        } else {
            this.currentPiece = undefined;
        }

        if (snapshot.heldPiece) {
            if (this.heldPiece) {
                const piece = this.heldPiece;
                piece.restore(snapshot.heldPiece);
                this.heldPiece = piece;
            }
            else {
                this.heldPiece = new PieceBuilder().build();
                this.heldPiece.restore(snapshot.heldPiece);
            }
        }
        else {
            this.heldPiece = undefined
        }

        const position = this.currentPiecePosition;
        position.restore(snapshot.currentPiecePosition);
        this.currentPiecePosition = position;
    }

}

export { Game, GameSnapshot }