import { Piece } from '../piece';

abstract class Generator {

    constructor(protected queue: Piece[]) { }

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
            return piece;
        }
        throw new Error("called spawn piece on an empty queue");
    }

    public getPreview(nbPreviewPieces: number): Piece[] {
        return this.queue.slice(0, nbPreviewPieces);
    }

    public canSpawnPiece(): boolean {
        return this.queue.length > 0;
    }

    public abstract clone(): Generator;

}
export { Generator }