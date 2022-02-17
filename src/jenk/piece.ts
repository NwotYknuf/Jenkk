import { MinoType } from "./mino";

/* 
 * A piece is represented by : 
 *  -its position
 *  -its type
 *  -its shape
 *  -its shift
 * 
 *  Shape represents the position of the minos relative to its center. ex : the Z piece
 * 
 *  { x: -1, y: 1 } { x: 0, y: 1 } {            }
 *  {             } { x: 0, y: 0 } { x: 1, y: 0 }
 *  {             } {            } {            }
 * 
 * Even pieces like O and I require a shift as their center is not an integer ex : O has a shift of 0.5
 * { x: -0.5, y: 0.5  } { x: 0.5, y: 0.5 }
 * { x: -0.5, y: -0.5 } { x: 0.5, y: -0.5 }
 * 
 */

enum RotationState {
    flat,
    right,
    fliped,
    left,
}

type MinoPosition = {
    x: number,
    y: number
}

class Piece {

    constructor(public x: number, public y: number, public centerShift: number, public rotation: RotationState, public type: MinoType, public shape: MinoPosition[]) { }

    public static copyShape(shape: MinoPosition[]): MinoPosition[] {
        const res: MinoPosition[] = [];
        shape.forEach((minoPos) => {
            res.push({ x: minoPos.x, y: minoPos.y });
        })
        return res;
    }

    public rotateCCW(): void {
        this.shape.forEach(mino => {
            const temp = mino.x;
            mino.x = -mino.y;
            mino.y = temp;
        });
        this.rotation--;
        if (this.rotation < 0) {
            this.rotation += 4;
        }
    }

    public rotateCW(): void {
        this.shape.forEach(mino => {
            const temp = mino.x;
            mino.x = mino.y;
            mino.y = -temp;
        });
        this.rotation = (this.rotation + 1) % 4;
    }

    public rotate180(): void {
        this.rotateCW();
        this.rotateCW();
    }

    public clone(): Piece {
        return new Piece(this.x, this.y, this.centerShift, this.rotation, this.type, Piece.copyShape(this.shape));
    }

}

export { Piece, RotationState, type MinoPosition }