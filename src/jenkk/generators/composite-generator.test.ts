import { MinoType } from "../mino";
import { Piece, RotationState } from "../piece";
import { BagGenerator } from "./bag-generator";
import { CompositeGenerator } from "./composite-generator";
import { Generator } from "./generator";
import { hasRNG } from "./has-rng";
import { LCG } from "./lcg";
import { SequenceGenerator } from "./sequence-generator";

describe('Composite Generator', () => {

    const first = new Piece(3, 3, 0, RotationState.flat, MinoType.J, [{ x: 0, y: 0 }]);
    const second = new Piece(3, 3, 0, RotationState.flat, MinoType.L, [{ x: 1, y: 1 }]);
    const third = new Piece(3, 3, 0, RotationState.flat, MinoType.O, [{ x: 2, y: 2 }]);
    const bag = [first, second, third];

    let generator: CompositeGenerator;

    beforeEach(() => {
        const genA = new SequenceGenerator(3, 3, 5, Generator.cloneQueue([first, second]));
        const genB = new SequenceGenerator(3, 3, 5, Generator.cloneQueue([third]));
        const genC = new BagGenerator(3, 3, 3, [], Generator.cloneQueue(bag), new LCG(1));
        generator = new CompositeGenerator(3, 3, 5, [], [genA, genB, genC])
    });

    it("refills", () => {
        expect(generator.shouldRefill()).toBe(true);
        generator.refill();
        expect(generator.getPreview()).toEqual([first, second, third, second, first]);
        expect(generator.shouldRefill()).toBe(false);
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