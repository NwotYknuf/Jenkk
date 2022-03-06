import { Generator, GeneratorSnapshot } from "./generator";
import { CanReffil, canRefill } from "./can-refill"
import { hasRNG, HasRNG } from "./has-rng";
import { Piece } from "../piece";

class CompositeGeneratorSnapshot extends GeneratorSnapshot {

    public generators: Generator[];

    constructor(queue: Piece[], generators: Generator[]) {
        super(queue);
        this.generators = CompositeGenerator.cloneGenerators(generators);
    }

}

class CompositeGenerator extends Generator implements CanReffil, HasRNG {

    public constructor(queue: Piece[], private generators: Generator[]) {
        super(queue);
    }

    public shouldRefill(nbPreviewPieces: number): boolean {
        return this.queue.length < nbPreviewPieces;
    }

    public refill(): void {

        this.generators.forEach((generator) => {

            if (canRefill(generator)) {
                const refillableGenerator = generator as any as CanReffil;
                refillableGenerator.refill();
            }

            while (generator.canSpawnPiece()) {
                this.queue.push(generator.spawnPiece());
            }

        });
    }

    public static cloneGenerators(generators: Generator[]) {
        const res: Generator[] = [];
        generators.forEach((generator) => {
            res.push(generator.clone());
        });
        return res;
    }

    public cloneWithNewRNG(): Generator {
        const queue = Generator.cloneQueue(this.queue);

        const generators: Generator[] = [];
        this.generators.forEach((generator) => {

            if (hasRNG(generator)) {
                const rngGen = generator as any as HasRNG;
                generators.push(rngGen.cloneWithNewRNG());
            }
            else {
                generators.push(generator.clone());
            }
        });

        return new CompositeGenerator(queue, generators);
    }

    public clone(): Generator {
        const generators: Generator[] = CompositeGenerator.cloneGenerators(this.generators);
        const queue = Generator.cloneQueue(this.queue);
        return new CompositeGenerator(queue, generators);
    }

    save(): GeneratorSnapshot {
        return new CompositeGeneratorSnapshot(this.queue, this.generators);
    }

    restore(snapshot: GeneratorSnapshot): void {
        const snapshotConverted = snapshot as CompositeGeneratorSnapshot;
        this.queue = Generator.cloneQueue(snapshotConverted.queue);
        this.generators = CompositeGenerator.cloneGenerators(snapshotConverted.generators);
    }

}

export { CompositeGenerator }