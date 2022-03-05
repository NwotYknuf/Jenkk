import { Piece } from "../piece";
import { CanReffil } from "./can-refill";
import { Generator } from "./generator"
import { HasRNG } from "./has-rng";
import { LCG } from "./lcg";

/*
 * A random bag generator
 */
class BagGenerator extends Generator implements CanReffil, HasRNG {

    constructor(queue: Piece[], private bag: Piece[], private rng: LCG,) {
        super(queue);
    }

    public shouldRefill(nbPreviewPieces: number): boolean {
        return this.queue.length < nbPreviewPieces;
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
        return new BagGenerator(queueClone, bagClone, this.rng.clone());
    }

    public cloneWithNewRNG(): Generator {
        const bagClone = Generator.cloneQueue(this.bag);
        return new BagGenerator([], bagClone, new LCG(Date.now()));
    }

}

export { BagGenerator }