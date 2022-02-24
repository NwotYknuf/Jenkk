import { MinoType } from "../mino";
import { Piece, RotationState } from "../piece";
import { Generator } from "./generator";
import { BagGenerator } from "./bagGenerator";
import { LCG } from "./LCG";

describe("Sequence generator", () => {

    const first = new Piece(0, 0, 0, RotationState.flat, MinoType.J, [{ x: 0, y: 0 }]);
    const second = new Piece(0, 0, 0, RotationState.flat, MinoType.L, [{ x: 1, y: 1 }]);
    const third = new Piece(0, 0, 0, RotationState.flat, MinoType.O, [{ x: 2, y: 2 }]);

    const bag = [first, second, third];

    let bagGenerator: BagGenerator;

    beforeEach(() => {
        bagGenerator = new BagGenerator(3, 3, 3, [], Generator.cloneQueue(bag), new LCG(1));
    })

    it("Can refill", () => {
        expect(bagGenerator.shouldRefill()).toBe(true);
        expect(bagGenerator.canRefill()).toBe(true);
        bagGenerator.refill();
        const containsPieces = bag.every((bagPiece) => {
            return bagGenerator.getPreview().some((piece) => piece.type === bagPiece.type);
        })
        expect(containsPieces).toBe(true);
    });

    it("Return a preview", () => {
        bagGenerator.refill();
        const preview = bagGenerator.getPreview()
        expect(preview.length).toBe(3);
        expect(preview[0].type).toBe(MinoType.L);
        expect(preview[1].type).toBe(MinoType.J);
        expect(preview[2].type).toBe(MinoType.O);
    })

    it("Spawns a piece", () => {
        expect(bagGenerator.spawnPiece).toThrow();
        bagGenerator.refill();
        const piece = bagGenerator.spawnPiece();
        expect(piece.type).toBe(MinoType.L);
        expect(piece.x).toBe(bagGenerator.spawnX);
        expect(piece.y).toBe(bagGenerator.spawnY);
    })

    it("Can make a copy of itseld", () => {
        const copy = bagGenerator.clone() as BagGenerator;
        expect(copy).toEqual(bagGenerator);
    })

    it("Can make a copy of itseld with a new rng", () => {
        const copy = bagGenerator.cloneWithNewRNG() as BagGenerator;
        var { rng, ...bagGeneratorNoRNG } = bagGenerator as any;
        var { rng, ...copyNoRNG } = copy as any;
        expect(bagGeneratorNoRNG).toEqual(copyNoRNG);
    })

});
