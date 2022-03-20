import { GeneratorType } from "../builders/generator-builder";
import { Piece } from "../piece";
import { CanReffil } from "./can-refill";
import { Generator, GeneratorSnapshot } from "./generator"
import { HasRNG } from "./has-rng";
import { LCG } from "./lcg";

class InfiniteBagGeneratorSnapshot extends GeneratorSnapshot {
    public bag: Piece[];
    public rng: LCG;

    constructor(queue: Piece[], bag: Piece[], rng: LCG) {
        super(queue);
        this.bag = Generator.cloneQueue(bag);
        this.rng = rng.clone();
    }

    public toJSON() {
        return {
            type: GeneratorType.InfiniteBag,
            queue: GeneratorSnapshot.snapshotQueue(this.queue),
            bag: GeneratorSnapshot.snapshotQueue(this.bag)
        }
    }

}

class InfiniteBagGenerator extends Generator implements CanReffil, HasRNG {

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
        return new InfiniteBagGenerator(queueClone, bagClone, this.rng.clone());
    }

    public cloneWithNewRNG(): Generator {
        const bagClone = Generator.cloneQueue(this.bag);
        return new InfiniteBagGenerator([], bagClone, new LCG(Date.now()));
    }

    save(): GeneratorSnapshot {
        return new InfiniteBagGeneratorSnapshot(this.queue, this.bag, this.rng);
    }

    restore(snapshot: GeneratorSnapshot): void {
        const snapshotConverted = snapshot as InfiniteBagGeneratorSnapshot;
        this.queue = Generator.cloneQueue(snapshotConverted.queue);
        this.bag = Generator.cloneQueue(snapshotConverted.bag);
        this.rng = snapshotConverted.rng.clone();
    }
}

export { InfiniteBagGenerator }