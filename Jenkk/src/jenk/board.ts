import { Mino, MinoType } from './mino';
import { Piece } from './piece';

//the board is a two dimension array of minos. Minos only have a type for now
class Board {

    public minos: Mino[][];

    //builds a deep copy of the given board
    constructor(public length: number = 10, public height: number = 20, minos?: Mino[][]) {
        if (minos) {
            this.minos = Board.copyMinos(minos);
        }
        else {
            this.minos = this.emptyMinos(this.length, this.height)
        }
    }

    private emptyMinos(length: number, height: number): Mino[][] {
        const res: Mino[][] = [];

        for (let x = 0; x < length; x++) {
            res[x] = [];
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < length; x++) {
                res[x][y] = new Mino(MinoType.empty);
            }
        }

        return res;
    }

    public static copyMinos(minos: Mino[][]): Mino[][] {
        return minos.map((col) => {
            return col.map(cell => {
                return new Mino(cell.type);
            })
        });
    }

    public setMino(x: number, y: number, mino: Mino): void {
        this.minos[x][y] = mino;
    }

    public clone(): Board {
        return new Board(this.length, this.height, this.minos);
    }

    //returns the current board plus the current piece
    public getBoardWithPiece(piece: Piece, ghost?: Piece): Board {

        const res = this.clone();

        if (ghost) {
            for (let i = 0; i < ghost.shape.length; i++) {
                const mino = ghost.shape[i];
                const x = ghost.x + ghost.centerShift + mino.x;
                const y = ghost.y + ghost.centerShift + mino.y;
                res.minos[x][y] = new Mino(ghost.type);
            }
        }

        for (let i = 0; i < piece.shape.length; i++) {
            const mino = piece.shape[i];
            const x = piece.x + piece.centerShift + mino.x;
            const y = piece.y + piece.centerShift + mino.y;
            res.minos[x][y] = new Mino(piece.type);
        }

        return res;
    }

    //returns true if the piece collides or is out of bounds
    public collision(piece: Piece): boolean {
        let collision = false;

        piece.shape.forEach(mino => {
            if (piece.x + piece.centerShift + mino.x >= this.minos.length || piece.x + piece.centerShift + mino.x < 0) {
                collision = true;
                return;
            }

            if (piece.y + mino.y >= this.minos[0].length || piece.y + piece.centerShift + mino.y < 0) {
                collision = true;
                return;
            }

            if (this.minos[piece.x + piece.centerShift + mino.x][piece.y + piece.centerShift + mino.y].type !== MinoType.empty) {
                collision = true;
            }
        });

        return collision;
    }

    public allClear(): Boolean {

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.length; x++) {
                if (this.minos[x][y].type !== MinoType.empty) {
                    return false;
                }
            }
        }

        return true;
    }

    public export(): string {
        return JSON.stringify(this);
    }

}

export { Board }