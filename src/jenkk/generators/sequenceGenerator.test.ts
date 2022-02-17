import { MinoType } from "../mino";
import { Piece, RotationState } from "../piece";
import { Generator } from "./generator";
import { SequenceGenerator } from "./sequenceGenerator";

describe("Sequence generator", () => {

    const first = new Piece(0, 0, 0, RotationState.flat, MinoType.J, [{ x: 0, y: 0 }]);
    const second = new Piece(0, 0, 0, RotationState.flat, MinoType.L, [{ x: 1, y: 1 }]);
    const third = new Piece(0, 0, 0, RotationState.flat, MinoType.O, [{ x: 2, y: 2 }]);

    const queue = [first, second, third];

    let sequenceGenerator: SequenceGenerator;

    beforeEach(() => {
        sequenceGenerator = new SequenceGenerator(3, 3, 2, Generator.cloneQueue(queue));
    })

    it("Generates a given queue", () => {
        for (let i = 0; i < queue.length; i++) {
            const piece = sequenceGenerator.spawnPiece();
            const expected = queue[i];
            expected.x = 3;
            expected.y = 3;
            expect(piece).toEqual(expected);
        }
    });

    it("Return a preview", () => {
        expect(sequenceGenerator.getPreview()).toEqual(queue.slice(0, 2));
    })

    it("Can make a copy of itseld", () => {
        const copy = sequenceGenerator.clone() as SequenceGenerator;
        expect(copy).toEqual(sequenceGenerator);
    })

});
