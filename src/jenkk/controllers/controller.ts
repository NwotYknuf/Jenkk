import { GameState } from "../game-state";
import { InputController as InputManager } from "../input-controller";
import { RotationSystem } from "../rotationSystems/rotation-system";
import { Piece, RotationState } from '../piece';
import { Mino, MinoType } from '../mino';
import { Board } from "../board";
import { Generator } from "../generators/generator";
import { canRefill, CanReffil } from "../generators/can-refill";
import { HasRNG, hasRNG } from "../generators/has-rng";

/*
 * A basic game controller with an input controller and a rotation system
 * Perform all the basic tasks needed to run a tetris game
 */


type UpdateComponent<T> = {
    updated: boolean,
    value: T
}

type GameInfo = {
    board: UpdateComponent<Board>
    queue: UpdateComponent<Piece[]>
    held: UpdateComponent<Piece | undefined>
}

class Controller {

    private updatedBoard: boolean = false;
    private updatedQueue: boolean = false;
    private updatedHeld: boolean = false;

    constructor(private inputManager: InputManager, public state: GameState, private rotationSystem: RotationSystem) { }

    public boardWithPieceAndGhost(): Board {
        const ghost = this.getGhostPiece();
        const piece = this.state.currentPiece;

        if (piece) {
            return this.state.board.getBoardWithPiece(piece, ghost);
        }

        throw new Error("Called boardWithPieceAndGhost with no current piece")
    }

    public boardWithPiece(): Board {
        const piece = this.state.currentPiece;

        if (piece) {
            return this.state.board.getBoardWithPiece(piece);
        }

        throw new Error("Called boardWithPiece with no current piece")
    }

    public queue(): Piece[] { return this.state.generator.getPreview(); }

    private getGameInfo(): GameInfo {
        return {
            board: {
                updated: this.updatedBoard,
                value: this.boardWithPieceAndGhost()
            },
            queue: {
                updated: this.updatedQueue,
                value: this.queue()
            },
            held: {
                updated: this.updatedHeld,
                value: this.state.heldPiece
            }
        }
    }

    public init(): GameInfo {
        this.refillQueue();
        this.spawnPiece();
        return this.getGameInfo();
    }

    public update(): GameInfo {
        this.updatedBoard = false;
        this.updatedHeld = false;
        this.updatedQueue = false;
        this.inputManager.update(this);
        return this.getGameInfo();
    }

    public rotate(rotate: (board: Board, piece: Piece) => [boolean, Piece]): boolean {
        if (!this.state.currentPiece) {
            throw Error("called rotate without a current piece");
        }
        const [rotated, newPiece] = rotate.call(this.rotationSystem, this.state.board, this.state.currentPiece);
        if (rotated) {
            this.state.currentPiece = newPiece;
            this.updatedBoard = true;
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
    public movePiece(x: number, y: number, piece: Piece | undefined = this.state.currentPiece): boolean {

        if (!piece) {
            return false;
        }

        piece.x += x;
        piece.y += y;

        if (this.state.board.collision(piece)) {
            piece.x -= x;
            piece.y -= y;
            return false;
        }

        this.updatedBoard = true;
        return true;
    }

    //returns the ghost piece
    public getGhostPiece(): Piece {
        if (!this.state.currentPiece) {
            throw new Error("Tried to call getGhostPiece when current piece is undefined");
        }

        const ghost = this.state.currentPiece.clone();
        while (this.movePiece(0, -1, ghost));
        ghost.type = MinoType.ghost;
        return ghost;
    }

    //spawns a new piece from queue.
    public spawnPiece(): void {
        this.state.currentPiece = this.state.generator.spawnPiece();
        this.updatedBoard = true;
        this.updatedQueue = true;
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
        this.updatedBoard = true;
        this.updatedHeld = true;
        if (this.state.currentPiece) {
            this.resetPiece(this.state.currentPiece);
        }
        let temp = this.state.currentPiece
        this.state.currentPiece = this.state.heldPiece;
        this.state.heldPiece = temp;

        if (!this.state.currentPiece) {
            this.spawnPiece();
        }
    }

    //locks the current piece on the board
    public lockPiece(): void {
        this.state.board = this.boardWithPiece();
        this.updatedBoard = true;
    }

    public clearLines(): void {
        const board = this.state.board;

        for (let y = board.height - 1; y >= 0; y--) {
            let lineFull = true;
            for (let x = 0; x < board.length; x++) {
                if (board.minos[x][y].type === MinoType.empty) {
                    lineFull = false;
                    break;
                }
            }

            if (lineFull) {
                this.updatedBoard = true;
                //pop the line and push a new line on top
                for (let x = 0; x < board.length; x++) {
                    board.minos[x].splice(y, 1);
                    board.minos[x].push(new Mino());
                }
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
        this.updatedBoard = true;
        this.updatedHeld = true;
        this.updatedQueue = true;

        const currentGen = this.state.generator;
        let newGen: Generator

        if (hasRNG(currentGen)) {
            const gen = currentGen as unknown as HasRNG;
            newGen = gen.cloneWithNewRNG();
        }
        else {
            newGen = currentGen.clone();
        }

        this.state = new GameState(new Board(10, 20), newGen);
        this.init();
    }

    public skip(): void { }

}

export { Controller }