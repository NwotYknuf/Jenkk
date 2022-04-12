import { Position } from "../position";
import { RotationSystem } from "../rotationSystems/rotation-system";
import { Board } from "../board";
import { Piece } from "../piece";
import { Generator } from "../generators/generator";
import { Observable, Observer } from "../events/state";
import { Game } from "./game";

type Clear = {
    tspin: boolean,
    allClear: boolean,
    linesCleared: number,
}

class ObservableGame extends Game {

    private boardState: Observable<Board>;
    private queueState: Observable<Piece[]>;
    private currentPieceState: Observable<Piece | undefined>;
    private heldPieceState: Observable<Piece | undefined>;
    private clearState: Observable<Clear>;
    private currentPiecePositionState: Observable<Position>;

    public constructor(
        generator: Generator, rotationSystem: RotationSystem,
        spawPosition: Position, nbPreviewPieces: number, board: Board,
        currentPiece: Piece | undefined, heldPiece: Piece | undefined) {
        super(generator, rotationSystem, spawPosition, nbPreviewPieces, board, currentPiece, heldPiece);

        this.boardState = new Observable<(Board)>(board, true);
        this.queueState = new Observable<Piece[]>([], true);
        this.currentPieceState = new Observable<Piece | undefined>(currentPiece, true);
        this.heldPieceState = new Observable<Piece | undefined>(heldPiece, true);
        this.currentPiecePositionState = new Observable<Position>(spawPosition.clone(), true);
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

    public get generator() {
        return super.generator;
    }

    public set generator(generator: Generator) {
        super.generator = generator;
        this.queueState.setValue(this.queue);
    }

    public get board(): Board {
        return this.boardState.getValue();
    }

    public set board(board: Board) {
        super.board = board;
        this.boardState.setValue(board);
    }

    public get heldPiece(): Piece | undefined {
        return this.heldPieceState.getValue();
    }

    public set heldPiece(piece: Piece | undefined) {
        super.heldPiece = piece;
        this.heldPieceState.setValue(piece);
    }

    public get currentPiece(): Piece | undefined {
        return this.currentPieceState.getValue();
    }

    public set currentPiece(piece: Piece | undefined) {
        super.currentPiece = piece;
        this.currentPieceState.setValue(piece);
    }

    public set nbPreviewPieces(nbPreviewPieces: number) {
        super.nbPreviewPieces = nbPreviewPieces;
        this.queueState.setValue(this.queue);
    }

    public get currentPiecePosition(): Position {
        return this.currentPiecePositionState.getValue();
    }

    public set currentPiecePosition(pos: Position) {
        super.currentPiecePosition = pos;
        this.currentPiecePositionState.setValue(pos);
    }

    public get nbPreviewPieces() {
        return super.nbPreviewPieces;
    }

    public notifyObservers() {
        this.boardState.notifyChange();
        this.currentPiecePositionState.notifyChange();
        this.currentPieceState.notifyChange();
        this.heldPieceState.notifyChange();
        this.queueState.notifyChange();
        this.clearState.notifyChange();
    }

    public spawnPiece(): void {
        super.spawnPiece();
        this.queueState.setValue(this.queue);
    }

    public clearLines(): void {
        super.clearLines();
        this.clearState.setValue({ tspin: this.tSpin, allClear: this.board.allClear(), linesCleared: this.lastClear });
    }

    public refillQueue(): void {
        super.refillQueue();
        this.queueState.setValue(this.queue);
    }
}

export { ObservableGame, type Clear }