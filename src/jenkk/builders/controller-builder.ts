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

    static importControls(json: string): Map<string, Control> {
        return new Map<string, Control>(JSON.parse(json));
    }

    static exportControls(controls: Map<string, Control>): string {
        return JSON.stringify(Array.from(controls.entries()));
    }

    static setListeners(listener: Listeners, game: Game) {
        listener.board.forEach(listener => {
            game.addBoardWatcher(listener);
        });

        listener.queue.forEach(listener => {
            game.addQueueWatcher(listener);
        });

        listener.current.forEach(listener => {
            game.addCurrentPieceWatcher(listener);
        });

        listener.currentPos.forEach(listener => {
            game.addCurrentPiecePosWatcher(listener);
        });

        listener.held.forEach(listener => {
            game.addHeldWatcher(listener);
        });

        listener.clear.forEach(listener => {
            game.addClearWatcher(listener);
        });
    }

    build(controls?: Map<string, Control>, options?: Options) {
        const gameBuilder = new GameBuilder();
        const game = gameBuilder.default();
        const controlMap = controls ? controls : defaultControls;
        const gameOptions = options ? options : defaultOptions;
        return new Controller(game, controlMap, gameOptions.DAS, gameOptions.ARR, gameOptions.SDR);
    }

}

export { ControllerBuilder, type Listeners }