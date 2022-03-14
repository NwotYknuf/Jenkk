import { MinoType } from "../mino";
import { GameBuilder } from "./game-builder";
import { PieceBuilder } from "./piece-builder";


describe("GameBuilder", () => {

    let builder: GameBuilder;

    beforeAll(() => {
        builder = new GameBuilder();
    })

    it("Creates a game from a json string", () => {

        const jsonString = `{"generator":{"type":"Bag","queue":[{"prototype":"I"},{"prototype":"T"},{"prototype":"S"},{"prototype":"L"},{"prototype":"O"},{"prototype":"Z"}],"bag":[{"prototype":"I"},{"prototype":"J"},{"prototype":"L"},{"prototype":"O"},{"prototype":"S"},{"prototype":"T"},{"prototype":"Z"}]},"board":{"width":10,"height":20,"minos":[["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"]]},"currentPiece":{"prototype":"J"},"heldPiece":{"prototype": "J"}}`;
        const json = JSON.parse(jsonString);

        builder.loadJSON(json);
        const game = builder.build();

        expect(game.board.width).toBe(10);
        expect(game.board.height).toBe(20);
        expect(game.board.allClear()).toBe(true);

        expect(game.generator.getPreview(6)).toEqual([
            PieceBuilder.buildFromTemplate(MinoType.I),
            PieceBuilder.buildFromTemplate(MinoType.T),
            PieceBuilder.buildFromTemplate(MinoType.S),
            PieceBuilder.buildFromTemplate(MinoType.L),
            PieceBuilder.buildFromTemplate(MinoType.O),
            PieceBuilder.buildFromTemplate(MinoType.Z),
        ]);

        expect(game.currentPiece).toEqual(PieceBuilder.buildFromTemplate(MinoType.J));
        expect(game.heldPiece).toEqual(PieceBuilder.buildFromTemplate(MinoType.J));

    });

});