import { Mino, MinoType } from "../mino";
import { BoardBuilder } from "./board-builder";


describe("BoardBuilder", () => {

    let builder: BoardBuilder

    beforeAll(() => {
        builder = new BoardBuilder();
    });

    it("Creates an empty board when no params are given", () => {
        const board = builder.build();
        expect(board.allClear()).toBe(true);
        expect(board.width).toBe(10);
        expect(board.height).toBe(20);
    });

    it("Creates a board from a json string", () => {
        const expected = builder.build();
        expected.setMino(0, 0, new Mino(MinoType.I));

        const jsonString = `{"width":10,"height":20,"minos":[["I","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"],["E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E","E"]]}`;
        const json = JSON.parse(jsonString);

        builder.loadJSON(json);
        const board = builder.build();
        expect(board).toEqual(expected);

    });

});