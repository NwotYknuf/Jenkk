import { Board } from "../board";
import { Control, Controller } from "../controllers/controller";
import { Clear, Game } from "../controllers/game";
import { Observer } from "../events/state";
import { Piece } from "../piece";
import { GameBuilder } from "./game-builder";
import { Position } from "../position";

type Listeners = {
    board: Observer<Board>[],
    queue: Observer<Piece[]>[],
    held: Observer<Piece | undefined>[],
    current: Observer<Piece | undefined>[],
    currentPos: Observer<Position>[],
    clear: Observer<Clear>[]
}

type Options = {
    DAS: number;
    ARR: number;
    SDR: number;
}

const defaultOptions: Options = {
    DAS: 95,
    ARR: 0,
    SDR: 0
};

const defaultControls: Map<string, Control> = new Map<string, Control>([
    ["Numpad4", Control.left],
    ["Numpad6", Control.right],
    ["Numpad5", Control.softDrop],
    ["Space", Control.hardDrop],
    ["KeyQ", Control.rotateCCW],
    ["KeyW", Control.rotateCW],
    ["KeyR", Control.rotate180],
    ["KeyE", Control.hold],
    ["F2", Control.skip],
    ["F4", Control.reset],
    ["Backspace", Control.undo]
]);

class ControllerBuilder {

    private _controls: Map<string, Control> = defaultControls;
    private _options: Options = defaultOptions;
    private _listeners: Listeners = {
        board: [], queue: [], held: [], current: [], currentPos: [], clear: []
    }
    private _game: Game;

    constructor() {
        const gameBuilder = new GameBuilder();
        this._game = gameBuilder.build();
    }

    public set controls(controls: Map<string, Control>) {
        this._controls = controls;
    }

    public set options(options: Options) {
        this._options = options;
    }

    public set listeners(listeners: Listeners) {
        this._listeners = listeners;
    }

    public set game(game: Game) {
        this._game = game;
    }

    build() {

        this._listeners.board.forEach(listener => {
            this._game.addBoardWatcher(listener);
        });

        this._listeners.queue.forEach(listener => {
            this._game.addQueueWatcher(listener);
        });

        this._listeners.current.forEach(listener => {
            this._game.addCurrentPieceWatcher(listener);
        });

        this._listeners.currentPos.forEach(listener => {
            this._game.addCurrentPiecePosWatcher(listener);
        });

        this._listeners.held.forEach(listener => {
            this._game.addHeldWatcher(listener);
        });

        this._listeners.clear.forEach(listener => {
            this._game.addClearWatcher(listener);
        });

        return new Controller(this._game, this._controls, this._options.DAS, this._options.ARR, this._options.SDR);
    }

}

export { ControllerBuilder, type Listeners, type Options }