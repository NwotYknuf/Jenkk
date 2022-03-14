import { GeneratorType } from '../builders/generator-builder';
import { Generator, GeneratorSnapshot } from './generator';


class SequenceGeneratorSnapshot extends GeneratorSnapshot {

    public toJSON() {
        return {
            type: GeneratorType.Sequence,
            queue: GeneratorSnapshot.snapshotQueue(this.queue)
        }
    }
}

/*
 * A generator that always spawns pieces in the same order
 */
class SequenceGenerator extends Generator {

    public clone(): Generator {
        const clonedQueue = Generator.cloneQueue(this.queue)
        return new SequenceGenerator(clonedQueue);
    }

    save(): GeneratorSnapshot {
        return new SequenceGeneratorSnapshot(this.queue);
    }

    restore(snapshot: SequenceGeneratorSnapshot): void {
        this.queue = Generator.cloneQueue(snapshot.queue);
    }
}

export { SequenceGenerator }