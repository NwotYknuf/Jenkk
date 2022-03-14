import { Memento } from '../Memento';
import { Piece } from '../piece';

abstract class GeneratorSnapshot {
    public queue: Piece[]
    constructor(queue: Piece[]) {
        this.queue = Generator.cloneQueue(queue);
    }

    abstract toJSON(): any;

    public static snapshotQueue(queue: Piece[]) {

        return queue.map((piece) => {
            return piece.save().toJSON()
        })
    }

}

abstract class Generator implements Memento<GeneratorSnapshot>{

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

    abstract save(): GeneratorSnapshot;

    abstract restore(snapshot: GeneratorSnapshot): void;
}

export { Generator, GeneratorSnapshot }