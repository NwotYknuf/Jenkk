import { GameState } from "../game-state";
import { InputController as InputManager } from "../input-controller";
import { RotationSystem } from "../rotationSystems/rotation-system";
import { Piece } from '../piece';
import { Board } from "../board";

abstract class Controller<StateInfo, ClearInfo> {

    constructor(protected inputManager: InputManager<StateInfo, ClearInfo>, public state: GameState, protected rotationSystem: RotationSystem) { }

    public abstract boardWithPieceAndGhost(): Board;
    public abstract boardWithPiece(): Board;
    public abstract queue(): Piece[];
    public abstract init(): StateInfo;
    public abstract update(): StateInfo;

    public abstract rotate(rotate: (board: Board, piece: Piece) => [boolean, Piece]): boolean;

    public rotateCCW(): boolean {
        const func = Object.getPrototypeOf(this.rotationSystem).rotateCCW;
        return this.rotate(func);
    }

    public rotateCW(): boolean {
        const func = Object.getPrototypeOf(this.rotationSystem).rotateCW;
        return this.rotate(func);
    }

    public rotate180(): boolean {
        const func = Object.getPrototypeOf(this.rotationSystem).rotate180;
        return this.rotate(func);
    }

    public abstract movePiece(x: number, y: number, piece: Piece | undefined): boolean;

    public abstract getGhostPiece(): Piece;

    public abstract spawnPiece(): void;

    public abstract resetPiece(piece: Piece): void;

    public abstract hold(): void;

    public abstract lockPiece(): void;

    public abstract clearLines(): ClearInfo;

    public abstract refillQueue(): void;

    public abstract hardDrop(): void;

    public abstract reset(): void;

    public skip(): void { }

}

export { Controller }