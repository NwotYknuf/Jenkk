import { Piece } from '../piece';
import { Generator, GeneratorSnapshot } from './generator';

/*
 * A generator that always spawns pieces in the same order
 */
class SequenceGenerator extends Generator {

    constructor(queue: Piece[]) {
        super(queue);
    }

    public clone(): Generator {
        const clonedQueue = Generator.cloneQueue(this.queue)
        return new SequenceGenerator(clonedQueue);
    }

    save(): GeneratorSnapshot {
        return new GeneratorSnapshot(this.queue);
    }

    restore(snapshot: GeneratorSnapshot): void {
        this.queue = Generator.cloneQueue(snapshot.queue);
    }
}

export { SequenceGenerator }