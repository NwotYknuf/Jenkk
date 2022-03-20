import { Generator } from "../generators/generator";
import { InfiniteBagGenerator } from "../generators/infinite-bag-generator";
import { SequenceGenerator } from "../generators/sequence-generator";
import { LCG } from "../generators/lcg";
import { MinoType } from "../mino";
import { Piece } from "../piece";
import { PieceBuilder } from "./piece-builder"
import { CompositeGenerator } from "../generators/composite-generator";
import { BagGenerator } from "../generators/bag-generator";

enum GeneratorType {
    Sequence = "Sequence",
    Bag = "Bag",
    InfiniteBag = "InfiniteBag",
    Composite = "Composite"
}

const sevenBag: Piece[] = [
    PieceBuilder.buildFromTemplate(MinoType.I),
    PieceBuilder.buildFromTemplate(MinoType.J),
    PieceBuilder.buildFromTemplate(MinoType.L),
    PieceBuilder.buildFromTemplate(MinoType.O),
    PieceBuilder.buildFromTemplate(MinoType.S),
    PieceBuilder.buildFromTemplate(MinoType.T),
    PieceBuilder.buildFromTemplate(MinoType.Z)
];

class GeneratorBuilder {

    private _type: GeneratorType = GeneratorType.InfiniteBag;
    private _queue: Piece[] = [];
    private _bag: Piece[] = sevenBag;
    private _rng: LCG = new LCG(1);
    private _generators: Generator[] = [];

    public set type(type: GeneratorType) {
        this._type = type;
    }

    public set queue(_queue: Piece[]) {
        this._queue = _queue;
    }

    public set bag(bag: Piece[]) {
        this._bag = bag;
    }

    public set rng(rng: LCG) {
        this._rng = rng;
    }

    public set generators(generators: Generator[]) {
        this._generators = generators;
    }

    loadJSON(json: any) {
        if ("type" in json) {
            this._type = json.type as GeneratorType;
        }
        if ("queue" in json) {
            const queue = json.queue.map((piece: any) => {
                const builder = new PieceBuilder();
                builder.loadJSON(piece);
                return builder.build();
            });
            this._queue = queue;
        }
        if ("bag" in json) {
            const bag = json.bag.map((piece: any) => {
                const builder = new PieceBuilder();
                builder.loadJSON(piece);
                return builder.build();
            });
            this._bag = bag;
        }
        if ("generators" in json) {
            const generators = json.generators.map((generator: any) => {
                const builder = new GeneratorBuilder();
                builder.loadJSON(generator);
                return builder.build();
            });

            this._generators = generators;
        }
    }

    build(): Generator {
        switch (this._type) {
            case GeneratorType.Sequence:
                return new SequenceGenerator(this._queue);
            case GeneratorType.InfiniteBag:
                return new InfiniteBagGenerator(this._queue, this._bag, this._rng);
            case GeneratorType.Composite:
                return new CompositeGenerator(this._queue, this._generators);
            case GeneratorType.Bag:
                return new BagGenerator(this._queue, this._bag, this._rng, false);
        }
        throw new Error("Unknown generator type");
    }

}

export { GeneratorBuilder, GeneratorType }