import { Generator } from "../generators/generator";
import { Board } from "../board";
import { Game } from "../controllers/game"
import { Piece } from "../piece";
import { Position } from "../position";
import { RotationSystem } from "../rotationSystems/rotation-system";
import { BoardBuilder } from "./board-builder";
import { GeneratorBuilder } from "./generator-builder";
import { RotationSystemBuilder } from "./rotation-system-builder";
import { PieceBuilder } from "./piece-builder";
import { ObservableGame } from "../controllers/observable-game";

class GameBuilder {

    private _generator: Generator;
    private _rotationSystem: RotationSystem;
    private _board: Board;
    private _spawnPosition: Position = new Position(4, 17);
    private _numberOfPreviewPieces: number = 5;
    private _currentPiece: Piece | undefined;
    private _heldPiece: Piece | undefined;

    constructor() {
        const generatorBuilder = new GeneratorBuilder();
        this._generator = generatorBuilder.build();
        const rotationSystemBuilder = new RotationSystemBuilder();
        this._rotationSystem = rotationSystemBuilder.superRotationSystem();
        const boardBuilder = new BoardBuilder();
        this._board = boardBuilder.build();
    }

    public set generator(generator: Generator) {
        this._generator = generator;
    }

    public set rotationSystem(rotationSystem: RotationSystem) {
        this._rotationSystem = rotationSystem;
    }

    public set board(board: Board) {
        this._board = board;
    }

    public set spawnPosition(spawnPosition: Position) {
        this._spawnPosition = spawnPosition;
    }

    public set numberOfPreviewPieces(numberOfPreviewPieces: number) {
        this._numberOfPreviewPieces = numberOfPreviewPieces;
    }

    public set currentPiece(currentPiece: Piece | undefined) {
        this._currentPiece = currentPiece;
    }

    public set heldPiece(heldPiece: Piece | undefined) {
        this._heldPiece = heldPiece;
    }

    public loadJSON(json: any) {
        if ("generator" in json) {
            const builder = new GeneratorBuilder();
            builder.loadJSON(json.generator);
            this.generator = builder.build();
        }
        if ("board" in json) {
            const builder = new BoardBuilder();
            builder.loadJSON(json.board);
            this.board = builder.build();
        }
        if ("currentPiece" in json) {
            const builder = new PieceBuilder();
            builder.loadJSON(json.currentPiece);
            this.currentPiece = builder.build();
        }
        if ("heldPiece" in json) {
            const builder = new PieceBuilder();
            builder.loadJSON(json.heldPiece);
            this.heldPiece = builder.build();
        }
    }

    build() {
        return new ObservableGame(
            this._generator,
            this._rotationSystem,
            this._spawnPosition,
            this._numberOfPreviewPieces,
            this._board,
            this._currentPiece,
            this._heldPiece
        );
    }
}

export { GameBuilder }