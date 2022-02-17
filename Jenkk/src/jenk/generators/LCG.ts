//https://en.wikipedia.org/wiki/Linear_congruential_generator

class LCG {

    private multiplier: number = 1103515245;
    private modulus: number = 0x80000000;
    private increment: number = 12345;
    private x: number;

    constructor(public seed: number) {
        this.x = seed % this.modulus;
    }

    //generates a sudo random number between [0 1[
    public getNext(): number {
        this.x = (this.multiplier * this.x + this.increment) % this.modulus;
        return this.x / this.modulus;
    }

    public clone(): LCG {
        let res = new LCG(this.seed);
        res.x = this.x;
        return res;
    }
}

export { LCG }