

import { Piece } from '../piece';
import { Generator } from './generator';

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

}

export { SequenceGenerator }