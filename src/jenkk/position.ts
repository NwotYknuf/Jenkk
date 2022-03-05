import { Memento } from "./Memento";

class PiecePosSnapshot {
    public constructor(public x: number, public y: number) { }
}

class Position implements Memento<PiecePosSnapshot> {

    public constructor(private _x: number, private _y: number) { }

    public save(): PiecePosSnapshot {
        return new PiecePosSnapshot(this._x, this._y)
    }

    public get x() { return this._x }

    public get y() { return this._y }

    public set x(x: number) {
        this._x = x;
    }
    public set y(y: number) {
        this._y = y;
    }

    public restore(snapshot: PiecePosSnapshot): void {
        this._x = snapshot.x;
        this._y = snapshot.y;
    }

    public clone(): Position {
        return new Position(this._x, this._y);
    }

}

export { Position }