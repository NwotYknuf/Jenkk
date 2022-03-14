import { Memento } from "./Memento";

class PositionSnapshot {
    public constructor(public x: number, public y: number) { }

    public toJSON() {
        return {
            x: this.x,
            y: this.y
        }
    }
}

class Position implements Memento<PositionSnapshot> {

    public constructor(private _x: number, private _y: number) { }

    public save(): PositionSnapshot {
        return new PositionSnapshot(this._x, this._y)
    }

    public get x() { return this._x }

    public get y() { return this._y }

    public set x(x: number) {
        this._x = x;
    }
    public set y(y: number) {
        this._y = y;
    }

    public restore(snapshot: PositionSnapshot): void {
        this._x = snapshot.x;
        this._y = snapshot.y;
    }

    public clone(): Position {
        return new Position(this._x, this._y);
    }

}

export { Position, PositionSnapshot }