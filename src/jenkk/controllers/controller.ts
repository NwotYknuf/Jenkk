import { RotationType } from "../rotationSystems/rotation-system";
import { Game } from "./game";

enum Control {
    left,
    right,
    softDrop,
    hardDrop,
    rotateCCW,
    rotateCW,
    rotate180,
    hold,
    reset,
    skip
}

type KeyStatus = { pressed: boolean, pressedLastFrame: boolean, time: number }

class Controller {

    private DAS_Charge: number = 0;
    private ARR_Active: boolean = false;
    private ARR_Charge: number = 0;
    private SDR_Charge: number = 0;
    private lastTick: number = Date.now();
    private pressedKeys: Map<Control, KeyStatus> = new Map<Control, KeyStatus>();

    constructor(private game: Game, private controlsMap: Map<string, Control>, private DAS: number, private ARR: number, private SDR: number) {

        this.controlsMap.forEach((value, key) => {
            this.pressedKeys.set(value, { pressed: false, pressedLastFrame: false, time: 0 });
        });

        document.addEventListener('keydown', (event) => {
            if (!event.repeat) {
                if (event.code && this.controlsMap.has(event.code)) {
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
                const control = this.controlsMap.get(event.code);
                if (control !== undefined) {
                    let status = this.pressedKeys.get(control);
                    if (status) {
                        status.pressed = false;
                    }
                }
            }
        });

        this.game.refillQueue();
        this.game.spawnPiece();
        this.game.notifyObservers();
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
            while (this.ARR_Charge > this.ARR && this.game.movePiece(1, 0)) {
                this.ARR_Charge -= this.ARR;
            }
        }
    }

    private ARR_left(): void {
        if (this.ARR_Active) {
            while (this.ARR_Charge > this.ARR && this.game.movePiece(-1, 0)) {
                this.ARR_Charge -= this.ARR;
            }
        }
    }

    public update(): void {

        let elapsedTime = Date.now() - this.lastTick;

        if (this.getKeyDown(Control.left)) {
            this.game.movePiece(-1, 0);
            this.stopDAS();
        }
        if (this.getKeyDown(Control.right)) {
            this.game.movePiece(1, 0);
            this.stopDAS();
        }

        if (this.getKeyUp(Control.left) || this.getKeyUp(Control.right)) {
            this.stopDAS();
        }

        if (this.keyPressed(Control.softDrop)) {
            this.SDR_Charge += elapsedTime;
            while (this.SDR_Charge > this.SDR && this.game.movePiece(0, -1)) {
                this.SDR_Charge -= this.SDR;
            }
        }

        if (this.keyPressed(Control.left) || this.keyPressed(Control.right)) {
            this.DAS_Charge += elapsedTime;
            this.ARR_Charge += elapsedTime;
            if (this.DAS_Charge > this.DAS && !this.ARR_Active) {
                this.ARR_Active = true;
                this.ARR_Charge = this.DAS_Charge - this.DAS;
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
            this.game.rotate(RotationType.CW);
        }
        if (this.getKeyDown(Control.rotateCCW)) {
            this.game.rotate(RotationType.CCW);
        }
        if (this.getKeyDown(Control.rotate180)) {
            this.game.rotate(RotationType._180);
        }
        if (this.getKeyDown(Control.hardDrop)) {
            while (this.game.movePiece(0, -1));
            this.game.lockPiece();
            this.game.clearLines();
            this.game.spawnPiece();
            this.game.refillQueue();
        }
        if (this.getKeyDown(Control.hold)) {
            this.game.hold();
        }

        this.controlsMap.forEach((value) => {
            let status = this.pressedKeys.get(value);
            if (status) {
                status.pressedLastFrame = status.pressed;
            }
        });

        this.lastTick = Date.now();
        this.game.notifyObservers();
    }

}

export { Controller, Control }