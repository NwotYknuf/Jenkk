import { BasicController } from "./controllers/controller";

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
    ["F4", Control.reset]
]);

type KeyStatus = { pressed: boolean, pressedLastFrame: boolean, time: number }

class InputController {

    private DAS_Charge: number = 0;
    private ARR_Active: boolean = false;
    private ARR_Charge: number = 0;
    private SDR_Charge: number = 0;
    private lastTick: number = Date.now();
    private pressedKeys: Map<Control, KeyStatus> = new Map<Control, KeyStatus>();

    constructor(private controlsMap: Map<string, Control> = defaultControls, private DAS: number = 95, private ARR: number = 0, private SDR: number = 0) {

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

    private ARR_right(controller: BasicController): void {
        if (this.ARR_Active) {
            while (this.ARR_Charge > this.ARR && controller.movePiece(1, 0)) {
                this.ARR_Charge -= this.ARR;
            }
        }
    }

    private ARR_left(controller: BasicController): void {
        if (this.ARR_Active) {
            while (this.ARR_Charge > this.ARR && controller.movePiece(-1, 0)) {
                this.ARR_Charge -= this.ARR;
            }
        }
    }

    public update(controller: BasicController): void {

        let elapsedTime = Date.now() - this.lastTick;

        if (this.getKeyDown(Control.left)) {
            controller.movePiece(-1, 0);
            this.stopDAS();
        }
        if (this.getKeyDown(Control.right)) {
            controller.movePiece(1, 0);
            this.stopDAS();
        }

        if (this.getKeyUp(Control.left) || this.getKeyUp(Control.right)) {
            this.stopDAS();
        }

        if (this.keyPressed(Control.softDrop)) {
            this.SDR_Charge += elapsedTime;
            while (this.SDR_Charge > this.SDR && controller.movePiece(0, -1)) {
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
                    this.ARR_left(controller);
                }
                else {
                    this.ARR_right(controller);
                }
            }

        }
        else {
            //One key pressed
            if (this.keyPressed(Control.left,)) {
                this.ARR_left(controller);
            }

            if (this.keyPressed(Control.right)) {
                this.ARR_right(controller);
            }
        }

        //Simple keys
        if (this.getKeyDown(Control.rotateCW)) {
            controller.rotateCW();
        }
        if (this.getKeyDown(Control.rotateCCW)) {
            controller.rotateCCW();
        }
        if (this.getKeyDown(Control.rotate180)) {
            controller.rotate180();
        }
        if (this.getKeyDown(Control.hardDrop)) {
            controller.hardDrop();
        }
        if (this.getKeyDown(Control.hold)) {
            controller.hold();
        }
        if (this.getKeyDown(Control.reset)) {
            controller.reset();
        }
        if (this.getKeyDown(Control.skip)) {
            controller.skip();
        }

        //update state

        this.controlsMap.forEach((value) => {
            let status = this.pressedKeys.get(value);
            if (status) {
                status.pressedLastFrame = status.pressed;
            }
        });

        this.lastTick = Date.now();
    }

}

export { InputController }