import { Piece } from '../piece';

abstract class Generator {

    constructor(public spawnX: number, public spawnY: number, protected nbPreviewPieces: number = 5, protected queue: Piece[]) { }

    static cloneQueue(queue: Piece[]): Piece[] {
        const newQueue: Piece[] = [];
        queue.forEach(piece => {
            newQueue.push(piece.clone());
        });
        return newQueue;
    }

    public spawnPiece(): Piece {
        const piece = this.queue.shift();
        if (piece) {
            piece.x = this.spawnX;
            piece.y = this.spawnY;
            return piece;
        }
        throw new Error("called spawn piece on an empty queue");
    }

    public getPreview(): Piece[] {
        return this.queue.slice(0, this.nbPreviewPieces);
    }

    public canSpawnPiece(): boolean {
        return this.queue.length > 0;
    }

    public abstract clone(): Generator;

}
export { Generator }