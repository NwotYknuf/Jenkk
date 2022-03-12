import { BoardBuilder } from "../builders/board-builder";
import { GeneratorBuilder } from "../builders/generator-builder";
import { RotationType } from "../rotationSystems/rotation-system";
import { Command } from "./commands/command";
import { HardDropCommand } from "./commands/hard-drop-command";
import { HoldCommand } from "./commands/hold-command";
import { MoveCommand } from "./commands/move-command";
import { RotateCommand } from "./commands/rotate-command";
import { Game } from "./game";

enum Control {
    left = "left",
    right = "right",
    softDrop = "soft drop",
    hardDrop = "hard drop",
    rotateCCW = "rotate CCW",
    rotateCW = "rotate CW",
    rotate180 = "rotate 180",
    hold = "hold",
    reset = "reset",
    skip = "skip",
    undo = "undo"
}

type KeyStatus = { pressed: boolean, pressedLastFrame: boolean, time: number }

class Controller {

    private DAS_Charge: number = 0;
    private ARR_Active: boolean = false;
    private ARR_Charge: number = 0;
    private SDR_Charge: number = 0;
    private lastTick: number = Date.now();
    private pressedKeys: Map<Control, KeyStatus> = new Map<Control, KeyStatus>();
    private commandHistory: Command[] = [];

    constructor(private _game: Game, private controlsMap: Map<string, Control>, private _DAS: number, private _ARR: number, private _SDR: number) {

        this.controlsMap.forEach((value, key) => {
            this.pressedKeys.set(value, { pressed: false, pressedLastFrame: false, time: 0 });
        });

        document.addEventListener('keydown', (event) => {
            if (event.code && this.controlsMap.has(event.code)) {
                event.preventDefault();
                if (!event.repeat) {
                    const control = this.controlsMap.get(event.code);
                    if (control !== undefined) {
                        let status = this.pressedKeys.get(control);
                        if (status) {
                            status.pressed = true;
                            status.time = Date.now();
                        }
                    }
                }
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.code && this.controlsMap.has(event.code)) {
                event.preventDefault();
                const control = this.controlsMap.get(event.code);
                if (control !== undefined) {
                    let status = this.pressedKeys.get(control);
                    if (status) {
                        status.pressed = false;
                    }
                }
            }
        });
    }

    public set DAS(das: number) {
        this._DAS = das;
    }

    public get DAS() {
        return this._DAS;
    }

    public set ARR(arr: number) {
        this._ARR = arr
    }

    public get ARR() {
        return this._ARR;
    }

    public set SDR(sdr: number) {
        this._SDR = sdr;
    }

    public get SDR() {
        return this._SDR;
    }

    public set controls(controls: Map<string, Control>) {
        this.controlsMap = controls;
    }

    public get controls() {
        return this.controlsMap;
    }

    public get game() {
        return this._game;
    }

    public init() {
        this._game.refillQueue();
        this._game.spawnPiece();
        this._game.notifyObservers();
    }

    public getKeyCode(control: Control): string {
        let res: string = "";

        this.controlsMap.forEach((value, key) => {
            if (value === control) {
                res = key;
            }
        });
        return res;
    }

    public setControl(control: Control, newKey: string) {
        const oldKey = this.getKeyCode(control);
        this.controlsMap.delete(oldKey);
        this.controlsMap.set(newKey, control);
    }

    private getKeyDown(control: Control): boolean {

        let status = this.pressedKeys.get(control);
        if (status) {
            return status.pressed && !status.pressedLastFrame;
        }
        return false;
    }

    private keyPressed(control: Control): boolean {
        let status = this.pressedKeys.get(control);
        if (status) {
            return status.pressed
        }
        return false;
    }

    private getKeyUp(control: Control): boolean {
        let status = this.pressedKeys.get(control);
        if (status) {
            return !status.pressed && status.pressedLastFrame
        }
        return false;
    }

    private stopDAS(): void {
        this.DAS_Charge = 0;
        this.ARR_Charge = 0;
        this.ARR_Active = false;
    }

    private ARR_right(): void {
        if (this.ARR_Active) {
            let command = new MoveCommand(this._game, 1, 0);
            while (this.ARR_Charge > this._ARR && command.execute()) {
                this.ARR_Charge -= this._ARR;
            }
        }
    }

    private ARR_left(): void {
        if (this.ARR_Active) {
            let command = new MoveCommand(this._game, -1, 0);
            while (this.ARR_Charge > this._ARR && command.execute()) {
                this.ARR_Charge -= this._ARR;
            }
        }
    }

    private reset(): void {
        this.game.board = new BoardBuilder().empty(10, 20);
        this.game.generator = new GeneratorBuilder().sevenBag();
        this.game.currentPiece = undefined;
        this.game.heldPiece = undefined;
        this.init();
    }

    public update(): void {

        let elapsedTime = Date.now() - this.lastTick;

        if (this.getKeyDown(Control.left)) {
            const command = new MoveCommand(this._game, -1, 0);
            command.execute()
            this.stopDAS();
        }
        if (this.getKeyDown(Control.right)) {
            const command = new MoveCommand(this._game, 1, 0);
            command.execute();
            this.stopDAS();
        }

        if (this.getKeyUp(Control.left) || this.getKeyUp(Control.right)) {
            this.stopDAS();
        }

        if (this.keyPressed(Control.softDrop)) {
            this.SDR_Charge += elapsedTime;
            const command = new MoveCommand(this._game, 0, -1);
            while (this.SDR_Charge > this._SDR && command.execute()) {
                this.SDR_Charge -= this._SDR;
            }
        }

        if (this.keyPressed(Control.left) || this.keyPressed(Control.right)) {
            this.DAS_Charge += elapsedTime;
            this.ARR_Charge += elapsedTime;
            if (this.DAS_Charge > this._DAS && !this.ARR_Active) {
                this.ARR_Active = true;
                this.ARR_Charge = this.DAS_Charge - this._DAS;
            }
        }

        if (this.keyPressed(Control.left) && this.keyPressed(Control.right)) {
            //The last key pressed preveils
            const statusLeft = this.pressedKeys.get(Control.left);
            const statusRight = this.pressedKeys.get(Control.right);

            if (statusLeft && statusRight) {
                if (statusLeft.time > statusRight.time) {
                    this.ARR_left();
                }
                else {
                    this.ARR_right();
                }
            }

        }
        else {
            //One key pressed
            if (this.keyPressed(Control.left,)) {
                this.ARR_left();
            }

            if (this.keyPressed(Control.right)) {
                this.ARR_right();
            }
        }

        //Simple keys
        if (this.getKeyDown(Control.rotateCW)) {
            const command = new RotateCommand(this._game, RotationType.CW);
            command.execute()
        }
        if (this.getKeyDown(Control.rotateCCW)) {
            const command = new RotateCommand(this._game, RotationType.CCW);
            command.execute()
        }
        if (this.getKeyDown(Control.rotate180)) {
            const command = new RotateCommand(this._game, RotationType._180);
            command.execute()
        }
        if (this.getKeyDown(Control.hardDrop)) {
            const command = new HardDropCommand(this._game);
            command.execute();
            this.commandHistory.push(command);
        }
        if (this.getKeyDown(Control.hold)) {
            const command = new HoldCommand(this._game);
            command.execute();
            this.commandHistory.push(command);
        }
        if (this.getKeyDown(Control.undo)) {
            const command = this.commandHistory.pop();
            command?.undo();
        }
        if (this.getKeyDown(Control.reset)) {
            this.reset();
        }

        this.controlsMap.forEach((value) => {
            let status = this.pressedKeys.get(value);
            if (status) {
                status.pressedLastFrame = status.pressed;
            }
        });

        this.lastTick = Date.now();
        this._game.notifyObservers();
    }

}

export { Controller, Control }