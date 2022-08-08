import { MinoType } from "../mino";
import { GeneratorBuilder } from "./generator-builder"
import { PieceBuilder } from "./piece-builder";


describe("Generator builder", () => {

    let builder: GeneratorBuilder;

    beforeAll(() => {
        builder = new GeneratorBuilder();
    });

    it("Builds a generator from a json string", () => {
        const jsonString = `{"type":"InfiniteBag","queue":[{"prototype":"I"},{"prototype":"T"},{"prototype":"S"},{"prototype":"L"},{"prototype":"O"},{"prototype":"Z"}],"bag":[{"prototype":"I"},{"prototype":"J"},{"prototype":"L"},{"prototype":"O"},{"prototype":"S"},{"prototype":"T"},{"prototype":"Z"}]}`;
        const json = JSON.parse(jsonString);
        builder.loadJSON(json);
        const generator = builder.build();

        expect(generator.getPreview(6)).toEqual([
            PieceBuilder.buildFromTemplate(MinoType.I),
            PieceBuilder.buildFromTemplate(MinoType.T),
            PieceBuilder.buildFromTemplate(MinoType.S),
            PieceBuilder.buildFromTemplate(MinoType.L),
            PieceBuilder.buildFromTemplate(MinoType.O),
            PieceBuilder.buildFromTemplate(MinoType.Z),
        ]);

        expect((generator as any).bag).toEqual([
            PieceBuilder.buildFromTemplate(MinoType.I),
            PieceBuilder.buildFromTemplate(MinoType.J),
            PieceBuilder.buildFromTemplate(MinoType.L),
            PieceBuilder.buildFromTemplate(MinoType.O),
            PieceBuilder.buildFromTemplate(MinoType.S),
            PieceBuilder.buildFromTemplate(MinoType.T),
            PieceBuilder.buildFromTemplate(MinoType.Z)
        ])

    });

})