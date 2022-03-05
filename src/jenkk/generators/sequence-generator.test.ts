import { MinoType } from "../mino";
import { Piece, RotationState } from "../piece";
import { Generator } from "./generator";
import { SequenceGenerator } from "./sequence-generator";

describe("Sequence generator", () => {

    const first = new Piece(0, RotationState.flat, MinoType.J, [{ x: 0, y: 0 }]);
    const second = new Piece(0, RotationState.flat, MinoType.L, [{ x: 1, y: 1 }]);
    const third = new Piece(0, RotationState.flat, MinoType.O, [{ x: 2, y: 2 }]);

    const queue = [first, second, third];

    let sequenceGenerator: SequenceGenerator;
    const nbPreviewPieces = 2;

    beforeEach(() => {
        sequenceGenerator = new SequenceGenerator(Generator.cloneQueue(queue));
    })

    it("Generates a given queue", () => {
        for (let i = 0; i < queue.length; i++) {
            const piece = sequenceGenerator.spawnPiece();
            const expected = queue[i];
            expect(piece).toEqual(expected);
        }
    });

    it("Spawns a piece", () => {
        expect(sequenceGenerator.spawnPiece).toThrow();
        const piece = sequenceGenerator.spawnPiece();
        expect(piece.type).toBe(MinoType.J);
    })

    it("Return a preview", () => {
        expect(sequenceGenerator.getPreview(nbPreviewPieces)).toEqual(queue.slice(0, 2));
    });

    it("Can make a copy of itseld", () => {
        const copy = sequenceGenerator.clone() as SequenceGenerator;
        expect(copy).toEqual(sequenceGenerator);
    })

});