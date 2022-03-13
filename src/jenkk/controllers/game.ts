import { Position } from "../position";
import { RotationSystem, RotationType } from "../rotationSystems/rotation-system";
import { Board } from "../board";
import { Piece, RotationState } from "../piece";
import { Mino, MinoType } from "../mino";
import { Generator } from "../generators/generator";
import { CanReffil, canRefill } from "../generators/can-refill";
import { Observable, Observer } from "../events/state";
import { Memento } from "../Memento";

enum MoveType {
    none,
    movement,
    rotation
}

type Clear = {
    tspin: boolean,
    allClear: boolean,
    linesCleared: number,
}

class GameSnapshot {
    public generator: Generator;
    public board: Board;
    public currentPiece: Piece | undefined;
    public heldPiece: Piece | undefined;
    public currentPiecePosition: Position;

    constructor(
        generator: Generator, board: Board, currentPiece: Piece | undefined, heldPiece: Piece | undefined, currentPiecePosition: Position) {
        this.generator = generator.clone();
        this.board = board.clone();
        this.currentPiece = currentPiece?.clone();
        this.heldPiece = heldPiece?.clone();
        this.currentPiecePosition = currentPiecePosition.clone();
    }
}

class Game implements Memento<GameSnapshot> {

    private boardState: Observable<Board>;
    private queueState: Observable<Piece[]>;
    private currentPieceState: Observable<Piece | undefined>;
    private heldPieceState: Observable<Piece | undefined>;
    private clearState: Observable<Clear>;
    private currentPiecePositionState: Observable<Position>;

    private lastMove: MoveType = MoveType.none;
    private tSpin: boolean = false;

    public constructor(
        private _generator: Generator, private rotationSystem: RotationSystem, private spawPosition: Position, private nbPreviewPieces: number, _board: Board, currentPiece: Piece | undefined, heldPiece: Piece | undefined) {
        this.boardState = new Observable<(Board)>(_board, true);
        this.queueState = new Observable<Piece[]>([], true);
        this.currentPieceState = new Observable<Piece | undefined>(currentPiece, true);
        this.heldPieceState = new Observable<Piece | undefined>(heldPiece, true);
        this.currentPiecePositionState = new Observable<Position>(this.spawPosition.clone(), true);
        this.clearState = new Observable<Clear>({
            allClear: false,
            tspin: false,
            linesCleared: 0
        });
    }

    public addBoardWatcher(watcher: Observer<Board>) {
        this.boardState.watch(watcher);
    }

    public addQueueWatcher(watcher: Observer<Piece[]>) {
        this.queueState.watch(watcher);
    }

    public addHeldWatcher(watcher: Observer<Piece | undefined>) {
        this.heldPieceState.watch(watcher);
    }

    public addCurrentPieceWatcher(watcher: Observer<Piece | undefined>) {
        this.currentPieceState.watch(watcher);
    }

    public addCurrentPiecePosWatcher(watcher: Observer<Position>) {
        this.currentPiecePositionState.watch(watcher);
    }

    public addClearWatcher(watcher: Observer<Clear>) {
        this.clearState.watch(watcher);
    }

    public get generator(): Generator {
        return this._generator;
    }

    public set generator(generator: Generator) {
        this._generator = generator;
        this.queueState.setValue(this.queue);
    }

    public get board(): Board {
        return this.boardState.getValue();
    }

    public set board(board: Board) {
        this.boardState.setValue(board);
    }

    public get heldPiece(): Piece | undefined {
        return this.heldPieceState.getValue();
    }

    public set heldPiece(piece: Piece | undefined) {
        this.heldPieceState.setValue(piece);
    }

    public get currentPiece(): Piece | undefined {
        return this.currentPieceState.getValue();
    }

    public set currentPiece(piece: Piece | undefined) {
        this.currentPieceState.setValue(piece);
    }

    public get queue() {
        return this._generator.getPreview(this.nbPreviewPieces);
    }

    public get boardWithPiece(): Board {
        if (!this.currentPiece) {
            throw new Error("Called boardWithPiece with no current piece")
        }
        return this.board.getBoardWithPiece(this.currentPiece, this.currentPiecePosition);
    }

    public get currentPiecePosition(): Position {
        return this.currentPiecePositionState.getValue();
    }

    public set currentPiecePosition(pos: Position) {
        this.currentPiecePositionState.setValue(pos);
    }

    public notifyObservers() {
        this.boardState.notifyChange();
        this.currentPiecePositionState.notifyChange();
        this.currentPieceState.notifyChange();
        this.heldPieceState.notifyChange();
        this.queueState.notifyChange();
        this.clearState.notifyChange();
    }

    public rotate(rotation: RotationType): boolean {
        if (!this.currentPiece) {
            throw new Error("Tried to call rotate without a current piece");
        }

        const rotated = this.rotationSystem.rotate(this, rotation);
        if (rotated) {
            this.lastMove = MoveType.rotation;
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
        this.lastMove = MoveType.movement;
        return true;

    }

    public spawnPiece(): void {
        this.currentPiece = this._generator.spawnPiece();
        this.currentPiecePosition = this.spawPosition.clone();
        this.queueState.setValue(this._generator.getPreview(this.nbPreviewPieces));
    }

    public resetCurrentPiece(): void {

        this.currentPiecePosition = this.spawPosition.clone();

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
        this.tSpin = false;
        if (this.currentPiece?.type === MinoType.T && this.lastMove === MoveType.rotation) {
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
            this.tSpin = occupiedCorners > 2;
        }

        this.board = this.boardWithPiece;
    }

    public clearLines(): void {

        let clearedLines = 0;

        for (let y = this.board.height - 1; y >= 0; y--) {
            let lineFull = true;
            for (let x = 0; x < this.board.length; x++) {
                if (this.board.minos[x][y].type === MinoType.empty) {
                    lineFull = false;
                    break;
                }
            }

            if (lineFull) {
                clearedLines++;
                //pop the line and push a new line on top
                for (let x = 0; x < this.board.length; x++) {
                    this.board.minos[x].splice(y, 1);
                    this.board.minos[x].push(new Mino());
                }
            }
        }

        this.clearState.setValue({ tspin: this.tSpin, allClear: this.board.allClear(), linesCleared: clearedLines });

    }

    public refillQueue(): void {
        if (canRefill(this._generator)) {
            const gen = this._generator as unknown as CanReffil;
            if (gen.shouldRefill(this.nbPreviewPieces)) {
                gen.refill();
                this.queueState.setValue(this.queue);
            }
        }
    }

    save(): GameSnapshot {
        return new GameSnapshot(this.generator, this.board, this.currentPiece, this.heldPiece, this.currentPiecePosition);
    }

    restore(snapshot: GameSnapshot): void {
        this.generator = snapshot.generator.clone();
        this.board = snapshot.board.clone();
        this.currentPiece = snapshot.currentPiece?.clone();
        this.heldPiece = snapshot.heldPiece?.clone();
        this.currentPiecePosition = snapshot.currentPiecePosition.clone();
    }

}

export { Game, type Clear, GameSnapshot }