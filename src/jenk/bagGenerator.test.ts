import { BagGenerator } from "./generators/bagGenerator";
import { Generator } from "./generators/generator";
import { LCG } from "./generators/LCG";
import { MinoType } from "./mino";
import { Piece, RotationState } from "./piece";

describe("BagGenerator", () => {

    const first = new Piece(0, 0, 0, RotationState.flat, MinoType.J, [{ x: 0, y: 0 }]);
    const second = new Piece(0, 0, 0, RotationState.flat, MinoType.L, [{ x: 1, y: 1 }]);
    const third = new Piece(0, 0, 0, RotationState.flat, MinoType.O, [{ x: 2, y: 2 }]);

    const pieces = [first, second, third];

    let bagGenerator: BagGenerator;

    beforeEach(() => {
        bagGenerator = new BagGenerator(3, 3, 3, [], Generator.cloneQueue(pieces), new LCG(1));
    });

    it("Generates pieces given a set seed", () => {
        bagGenerator.refill();
        expect(bagGenerator.getPreview()).toEqual([second, first, third]);
    });

    it("Knows when to refill", () => {
        expect(bagGenerator.canRefill()).toBe(true);
        expect(bagGenerator.shouldRefill()).toBe(true);
        expect(bagGenerator.canSpawnPiece()).toBe(false);
        bagGenerator.refill();
        expect(bagGenerator.shouldRefill()).toBe(false);
        expect(bagGenerator.canSpawnPiece()).toBe(true);
    });

    it("Can clone itself", () => {
        let copy = bagGenerator.clone();
        expect(copy).toEqual(bagGenerator);
        bagGenerator.refill();
        copy = bagGenerator.clone();
        expect(copy).toEqual(bagGenerator);
    });

})