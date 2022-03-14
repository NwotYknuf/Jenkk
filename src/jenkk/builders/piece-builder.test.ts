import { MinoType } from "../mino";
import { PieceBuilder } from "./piece-builder";


describe("Piece Builder", () => {

    let builder: PieceBuilder;

    beforeAll(() => {
        builder = new PieceBuilder();
    })

    it("Builds an I piece if no input is given", () => {
        const piece = builder.build();
        expect(piece.type).toBe(MinoType.I);
    });

    it("Builds a piece from json text", () => {
        const jsonText = `{ "prototype": "J" }`;
        const json = JSON.parse(jsonText);
        builder.loadJSON(json);
        const piece = builder.build();
        expect(piece).toEqual(PieceBuilder.buildFromTemplate(MinoType.J));
    });

});