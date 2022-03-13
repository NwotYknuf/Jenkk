import { Board } from "../board"
import { Mino, MinoType } from "../mino";

class BoardBuilder {

    private _minos: Mino[][] | undefined;
    private _length: number = 10;
    private _height: number = 20;

    constructor() { }

    public set minos(minos: Mino[][]) {
        this._minos = minos;
    }

    public set length(length: number) {
        this._length = length;
    }

    public set height(height: number) {
        this._height = height;
    }

    build() {
        if (this._minos) {
            return new Board(Board.copyMinos(this._minos));
        }
        else {
            return this.empty();
        }
    }

    private empty() {
        const minos: Mino[][] = [];

        for (let x = 0; x < this._length; x++) {
            minos[x] = [];
        }

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._length; x++) {
                minos[x][y] = new Mino(MinoType.empty);
            }
        }
        return new Board(minos)
    }
}

export { BoardBuilder }