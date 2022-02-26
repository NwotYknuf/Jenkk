import { Generator } from "./generator";
import { CanReffil, canRefill } from "./can-refill"
import { hasRNG, HasRNG } from "./has-rng";
import { Piece } from "../piece";

class CompositeGenerator extends Generator implements CanReffil, HasRNG {

    public constructor(spawnX: number, spawnY: number, nbPreviewPieces: number = 5, queue: Piece[], private generators: Generator[]) {
        super(spawnX, spawnY, nbPreviewPieces, queue);
    }

    public shouldRefill(): boolean {
        return this.queue.length < this.nbPreviewPieces;
    }

    public refill(): void {

        this.generators.forEach((generator) => {

            if (canRefill(generator)) {
                const refillableGenerator = generator as any as CanReffil;
                if (refillableGenerator.shouldRefill()) {
                    refillableGenerator.refill();
                }
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

        return new CompositeGenerator(this.spawnX, this.spawnY, this.nbPreviewPieces, queue, generators);
    }

    public clone(): Generator {

        const generators: Generator[] = [];
        const queue = Generator.cloneQueue(this.queue);

        this.generators.forEach((generator) => {
            generators.push(generator.clone());
        });

        return new CompositeGenerator(this.spawnX, this.spawnY, this.nbPreviewPieces, queue, generators);
    }

}

export { CompositeGenerator }