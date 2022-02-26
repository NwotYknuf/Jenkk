import { GameState } from "../game-state";
import { InputController as InputManager } from "../input-controller";
import { RotationSystem } from "../rotationSystems/rotation-system";
import { Piece, RotationState } from '../piece';
import { Mino, MinoType } from '../mino';
import { Board } from "../board";
import { Generator } from "../generators/generator";
import { canRefill, CanReffil } from "../generators/can-refill";
import { HasRNG, hasRNG } from "../generators/has-rng";
import { State } from "../events/state";

type UpdateComponent<T> = {
    updated: boolean,
    value: T
}

type BasicStateInfo = {
    board: UpdateComponent<Board>
    queue: UpdateComponent<Piece[]>
    held: UpdateComponent<Piece | undefined>
}

class BasicController {

    public boardState: State<Board>;
    public queueState: State<Piece[]>;
    public heldPieceState: State<Piece | undefined>;
    public currentPieceState: State<Piece | undefined>;

    constructor(private inputManager: InputManager, private state: GameState, private rotationSystem: RotationSystem) {
        this.boardState = new State<Board>(this.state.board, false);
        this.queueState = new State<Piece[]>([], false);
        this.heldPieceState = new State<Piece | undefined>(this.state.heldPiece, false);
        this.currentPieceState = new State<Piece | undefined>(this.state.currentPiece, false);
    }

    public get board() {
        return this.state.board;
    }

    public set board(board: Board) {
        this.state.board = board;
        this.boardState.changed();
    }

    public get currentPiece() {
        return this.state.currentPiece;
    }

    public set currentPiece(piece: Piece | undefined) {
        this.state.currentPiece = piece;
        this.boardState.changed();
    }

    public get heldPiece() {
        return this.state.heldPiece;
    }

    public set heldPiece(piece: Piece | undefined) {
        this.state.heldPiece = piece;
        this.heldPieceState.setValue(piece);
    }

    public get boardWithPieceAndGhost(): Board {
        const ghost = this.ghostPiece;
        const piece = this.currentPiece;

        if (piece) {
            return this.state.board.getBoardWithPiece(piece, ghost);
        }

        throw new Error("Called boardWithPieceAndGhost with no current piece")
    }

    public get boardWithPiece(): Board {
        const piece = this.currentPiece;

        if (piece) {
            return this.board.getBoardWithPiece(piece);
        }

        throw new Error("Called boardWithPiece with no current piece")
    }

    public get queue() {
        return this.state.generator.getPreview();
    }

    public notifyObservers() {
        if (this.boardState.hasChanged) {
            this.boardState.setValue(this.boardWithPieceAndGhost);
        }

        this.boardState.notify();
        this.currentPieceState.notify();
        this.heldPieceState.notify();
        this.queueState.notify();
    }

    public init(): void {
        this.refillQueue();
        this.spawnPiece();
        this.boardState.changed();
        this.notifyObservers();
    }

    public update(): void {
        this.inputManager.update(this);
        this.notifyObservers();
    }

    public rotate(rotate: (board: Board, piece: Piece) => [boolean, Piece]): boolean {
        if (!this.currentPiece) {
            throw Error("called rotate without a current piece");
        }
        const [rotated, newPiece] = rotate.call(this.rotationSystem, this.board, this.currentPiece);
        if (rotated) {
            this.currentPiece = newPiece;
        }
        return rotated;
    }

    //tries to rotate the current piece. returns true if the piece was rotated
    public rotateCCW(): boolean {
        const func = Object.getPrototypeOf(this.rotationSystem).rotateCCW;
        return this.rotate(func);
    }

    //tries to rotate the current piece. returns true if the piece was rotated
    public rotateCW(): boolean {
        const func = Object.getPrototypeOf(this.rotationSystem).rotateCW;
        return this.rotate(func);
    }

    //tries to rotate the current piece. returns true if the piece was rotated
    public rotate180(): boolean {
        const func = Object.getPrototypeOf(this.rotationSystem).rotate180;
        return this.rotate(func);
    }

    //tries to move the current piece. return true if the piece was moved
    public movePiece(x: number, y: number): boolean {

        if (!this.currentPiece) {
            return false;
        }
        let copy = this.currentPiece.clone();
        copy.x += x;
        copy.y += y;
        if (this.board.collision(copy)) {
            return false;
        }
        this.currentPiece = copy;
        return true;
    }

    //returns the ghost piece
    public get ghostPiece(): Piece {
        if (!this.currentPiece) {
            throw new Error("Tried to call getGhostPiece when current piece is undefined");
        }
        const ghost = this.currentPiece.clone();
        while (!this.board.collision(ghost)) {
            ghost.y--;
        };
        ghost.y++;
        ghost.type = MinoType.ghost;
        return ghost;
    }

    //spawns a new piece from queue.
    public spawnPiece(): void {
        this.currentPiece = this.state.generator.spawnPiece();
        this.queueState.setValue(this.queue);
    }

    public resetPiece(piece: Piece): void {
        const generator = this.state.generator;
        piece.x = generator.spawnX;
        piece.y = generator.spawnY;
        if (piece.rotation === RotationState.right) {
            this.rotateCCW();
        }
        if (piece.rotation === RotationState.left) {
            piece.rotateCW();
        }
        if (piece.rotation === RotationState.fliped) {
            piece.rotate180();
        }
    }

    public hold(): void {

        if (this.currentPiece) {
            this.resetPiece(this.currentPiece);
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

    //locks the current piece on the board
    public lockPiece(): void {
        this.board = this.boardWithPiece;
    }

    public clearLines(): void {
        const board = this.board;

        for (let y = board.height - 1; y >= 0; y--) {
            let lineFull = true;
            for (let x = 0; x < board.length; x++) {
                if (board.minos[x][y].type === MinoType.empty) {
                    lineFull = false;
                    break;
                }
            }

            if (lineFull) {
                //pop the line and push a new line on top
                for (let x = 0; x < board.length; x++) {
                    board.minos[x].splice(y, 1);
                    board.minos[x].push(new Mino());
                }
                this.boardState.changed();
            }
        }
    }

    //refils the bag
    public refillQueue(): void {
        if (canRefill(this.state.generator)) {
            const gen = this.state.generator as unknown as CanReffil;
            if (gen.shouldRefill()) {
                gen.refill();
            }
        }
    }

    public hardDrop(): void {
        while (this.movePiece(0, -1));
        this.lockPiece();
        this.clearLines();
        this.spawnPiece();
        this.refillQueue();
    }

    public reset(): void {
        const currentGen = this.state.generator;
        let newGen: Generator

        if (hasRNG(currentGen)) {
            const gen = currentGen as unknown as HasRNG;
            newGen = gen.cloneWithNewRNG();
        }
        else {
            newGen = currentGen.clone();
        }

        this.board = new Board(10, 20);
        this.queueState.setValue([]);
        this.state.generator = newGen;
        this.heldPiece = undefined;
        this.currentPiece = undefined;
        this.init();
    }

    public skip(): void { }

}

export { BasicController, type BasicStateInfo }