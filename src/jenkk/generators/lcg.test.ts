import { LCG } from "./lcg";

describe("Linear congruential generator", () => {

    let rng: LCG;

    beforeEach(() => {
        rng = new LCG(1);
    });

    it("Generates the same numbers given the same seed", () => {
        const expectedNumbers = [51, 17, 15, 14, 28, 92, 0]
        for (let i = 0; i < expectedNumbers.length; i++) {
            const n = Math.trunc((rng.getNext() * 100));
            expect(n).toBe(expectedNumbers[i]);
        }
    });

    it("Can make a copy of itself", () => {

        let clone = rng.clone();

        expect(clone).toEqual(rng);

        //the clone generates the same sequence
        let expectedNumbers = [51, 17, 15, 14, 28, 92, 0]
        for (let i = 0; i < expectedNumbers.length; i++) {
            const n = Math.trunc((clone.getNext() * 100));
            expect(n).toBe(expectedNumbers[i]);
        }

        //the clone generates the same sequence after rng has been modified
        rng.getNext();
        clone = rng.clone();

        expectedNumbers = [17, 15, 14, 28, 92, 0]
        for (let i = 0; i < expectedNumbers.length; i++) {
            const n = Math.trunc((clone.getNext() * 100));
            expect(n).toBe(expectedNumbers[i]);
        }

    })

});