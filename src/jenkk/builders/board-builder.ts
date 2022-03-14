import { Board } from "../board"
import { Mino, MinoType } from "../mino";

class BoardBuilder {

    private _minos: Mino[][] | undefined;
    private _width: number = 10;
    private _height: number = 20;

    public set minos(minos: Mino[][]) {
        this._minos = minos;
    }

    public set length(length: number) {
        this._width = length;
    }

    public set height(height: number) {
        this._height = height;
    }

    loadJSON(json: any) {
        if ("height" in json) {
            this._height = json.height;
        }
        if ("width" in json) {
            this._width = json.width;
        }
        if ("minos" in json) {

            const minos = (json.minos as (keyof typeof MinoType)[][]).map((col) => {
                return col.map((mino) => {
                    return new Mino(MinoType[mino]);
                });
            });

            this._minos = minos;
        }
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

        for (let x = 0; x < this._width; x++) {
            minos[x] = [];
        }

        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                minos[x][y] = new Mino(MinoType.empty);
            }
        }
        return new Board(minos)
    }
}

export { BoardBuilder }