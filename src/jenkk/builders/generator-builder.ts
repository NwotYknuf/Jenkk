import { BagGenerator } from "../generators/bag-generator";
import { LCG } from "../generators/lcg";
import { PieceBuilder } from "./piece-builder"

class GeneratorBuilder {

    testSevenBag() {
        const pieceBuilder = new PieceBuilder();
        const bag = [
            pieceBuilder.I(),
            pieceBuilder.J(),
            pieceBuilder.L(),
            pieceBuilder.O(),
            pieceBuilder.S(),
            pieceBuilder.T(),
            pieceBuilder.Z()
        ];

        return new BagGenerator([], bag, new LCG(1));
    }

    sevenBag() {
        const pieceBuilder = new PieceBuilder();
        const bag = [
            pieceBuilder.I(),
            pieceBuilder.J(),
            pieceBuilder.L(),
            pieceBuilder.O(),
            pieceBuilder.S(),
            pieceBuilder.T(),
            pieceBuilder.Z()
        ];

        return new BagGenerator([], bag, new LCG(Date.now()));

    }


}

export { GeneratorBuilder }