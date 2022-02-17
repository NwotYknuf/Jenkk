import { Piece } from "../piece";
import { CanReffil } from "./canRefill";
import { Generator } from "./generator"
import { HasRNG } from "./hasRNG";
import { LCG } from "./LCG";

/*
 * A random bag generator
 */
class BagGenerator extends Generator implements CanReffil, HasRNG {

    constructor(spawnX: number, spawnY: number, nbPreviewPieces: number, queue: Piece[], private bag: Piece[], private rng: LCG,) {
        super(spawnX, spawnY, nbPreviewPieces, queue);
    }

    public shouldRefill(): boolean {
        return this.queue.length < this.nbPreviewPieces;
    }
    public canRefill(): boolean {
        return true;
    }

    public refill(): void {
        const newPieces = Generator.cloneQueue(this.bag);
        newPieces.sort((a, b) => 0.5 - this.rng.getNext());
        this.queue.push(...newPieces);
    }

    public clone(): Generator {
        const queueClone = Generator.cloneQueue(this.queue);
        const bagClone = Generator.cloneQueue(this.bag);
        return new BagGenerator(this.spawnX, this.spawnY, this.nbPreviewPieces, queueClone, bagClone, this.rng.clone());
    }

    public cloneWithNewRNG(): Generator {
        const bagClone = Generator.cloneQueue(this.bag);
        return new BagGenerator(this.spawnX, this.spawnY, this.nbPreviewPieces, [], bagClone, new LCG(Date.now()));
    }

}

export { BagGenerator }