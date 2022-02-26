

import { Piece } from '../piece';
import { Generator } from './generator';

/*
 * A generator that always spawns pieces in the same order
 */
class SequenceGenerator extends Generator {

    constructor(spawnX: number, spawnY: number, nbPreviewPieces: number = 5, queue: Piece[]) {
        super(spawnX, spawnY, nbPreviewPieces, queue);
    }

    public clone(): Generator {
        const clonedQueue = Generator.cloneQueue(this.queue)
        return new SequenceGenerator(this.spawnX, this.spawnY, this.nbPreviewPieces, clonedQueue);
    }

}

export { SequenceGenerator }