import { Generator } from "./generator";
import { CanReffil, canRefill } from "./can-refill"
import { hasRNG, HasRNG } from "./has-rng";
import { Piece } from "../piece";

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

    public cloneWithNewRNG(): Generator {
        const generators: Generator[] = [];
        const queue = Generator.cloneQueue(this.queue);

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

        const generators: Generator[] = [];
        const queue = Generator.cloneQueue(this.queue);

        this.generators.forEach((generator) => {
            generators.push(generator.clone());
        });

        return new CompositeGenerator(queue, generators);
    }

}

export { CompositeGenerator }