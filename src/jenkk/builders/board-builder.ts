import { Board } from "../board"
import { Mino, MinoType } from "../mino";

class BoardBuilder {

    empty(length: number, height: number) {
        const minos: Mino[][] = [];

        for (let x = 0; x < length; x++) {
            minos[x] = [];
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < length; x++) {
                minos[x][y] = new Mino(MinoType.empty);
            }
        }
        return new Board(minos)
    }

    withMinos(mino: Mino[][]) {
        return new Board(mino);
    }

}

export { BoardBuilder }