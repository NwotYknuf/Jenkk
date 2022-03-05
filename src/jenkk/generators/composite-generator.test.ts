import { MinoType } from "../mino";
import { Piece, RotationState } from "../piece";
import { BagGenerator } from "./bag-generator";
import { CompositeGenerator } from "./composite-generator";
import { Generator } from "./generator";
import { hasRNG } from "./has-rng";
import { LCG } from "./lcg";
import { SequenceGenerator } from "./sequence-generator";

describe('Composite Generator', () => {

    const first = new Piece(0, RotationState.flat, MinoType.J, [{ x: 0, y: 0 }]);
    const second = new Piece(0, RotationState.flat, MinoType.L, [{ x: 1, y: 1 }]);
    const third = new Piece(0, RotationState.flat, MinoType.O, [{ x: 2, y: 2 }]);
    const bag = [first, second, third];

    let generator: CompositeGenerator;
    const nbPreviewPieces = 5;
    beforeEach(() => {
        const genA = new SequenceGenerator(Generator.cloneQueue([first, second]));
        const genB = new SequenceGenerator(Generator.cloneQueue([third]));
        const genC = new BagGenerator([], Generator.cloneQueue(bag), new LCG(1));
        generator = new CompositeGenerator([], [genA, genB, genC])
    });

    it("refills", () => {
        expect(generator.shouldRefill(nbPreviewPieces)).toBe(true);
        generator.refill();
        expect(generator.getPreview(nbPreviewPieces)).toEqual([first, second, third, second, first]);
        expect(generator.shouldRefill(nbPreviewPieces)).toBe(false);
    });

    it("can make a copy of itsefl", () => {
        expect(generator.clone()).toEqual(generator);
    });

    it("can make a copy of itsefl with new RNG", () => {
        const copy = generator.cloneWithNewRNG();

        const generatorsNoRNG = (generator as any).generators
        generatorsNoRNG.forEach((generator: any, index: number) => {
            if (hasRNG(generator)) {
                var { rng, ...generatorNoRNG } = generator;
                generatorsNoRNG[index] = generatorNoRNG;
            }
        });

        const copyNoRNG = (copy as any).generators
        copyNoRNG.forEach((generator: any, index: number) => {
            if (hasRNG(generator)) {
                var { rng, ...generatorNoRNG } = generator;
                copyNoRNG[index] = generatorNoRNG;
            }
        });

        expect(copyNoRNG).toEqual(generatorsNoRNG);

    });

});