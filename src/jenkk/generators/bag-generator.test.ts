import { MinoType } from "../mino";
import { Piece, RotationState } from "../piece";
import { Generator } from "./generator";
import { BagGenerator } from "./bag-generator";
import { LCG } from "./lcg";

describe("Bag generator", () => {

    const first = new Piece(0, RotationState.flat, MinoType.J, [{ x: 0, y: 0 }]);
    const second = new Piece(0, RotationState.flat, MinoType.L, [{ x: 1, y: 1 }]);
    const third = new Piece(0, RotationState.flat, MinoType.O, [{ x: 2, y: 2 }]);

    const bag = [first, second, third];

    let bagGenerator: BagGenerator;
    const nbPreviewPieces = 3;

    beforeEach(() => {
        bagGenerator = new BagGenerator([], Generator.cloneQueue(bag), new LCG(1));
    })

    it("Can refill", () => {
        expect(bagGenerator.shouldRefill(nbPreviewPieces)).toBe(true);
        expect(bagGenerator.canRefill()).toBe(true);
        bagGenerator.refill();
        const containsPieces = bag.every((bagPiece) => {
            return bagGenerator.getPreview(nbPreviewPieces).some((piece) => piece.type === bagPiece.type);
        })
        expect(containsPieces).toBe(true);
    });

    it("Return a preview", () => {
        bagGenerator.refill();
        const preview = bagGenerator.getPreview(nbPreviewPieces)
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
