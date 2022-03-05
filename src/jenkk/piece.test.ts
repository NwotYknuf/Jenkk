import { MinoType } from "./mino";
import { Piece, RotationState } from "./piece";

describe("Piece", () => {

    let piece: Piece;
    const epsilon: number = 0.0001;


    beforeEach(() => {
        piece = new Piece(0, RotationState.flat, MinoType.J, [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]);
    });

    it("rotates the piece clowise", () => {
        piece.rotateCW();
        expect(piece.rotation).toBe(RotationState.right);
        expect(piece.shape[0].x).toBeCloseTo(1, epsilon);
        expect(piece.shape[0].y).toBeCloseTo(1, epsilon);
        expect(piece.shape[1].x).toBeCloseTo(0, epsilon);
        expect(piece.shape[1].y).toBeCloseTo(1, epsilon);
        expect(piece.shape[2].x).toBeCloseTo(0, epsilon);
        expect(piece.shape[2].y).toBeCloseTo(0, epsilon);
        expect(piece.shape[3].x).toBeCloseTo(0, epsilon);
        expect(piece.shape[3].y).toBeCloseTo(-1, epsilon);
    });

    it("rotates the piece counter clockwise", () => {
        piece.rotateCCW();
        expect(piece.rotation).toBe(RotationState.left);
        expect(piece.shape[0].x).toBeCloseTo(-1, epsilon);
        expect(piece.shape[0].y).toBeCloseTo(-1, epsilon);
        expect(piece.shape[1].x).toBeCloseTo(0, epsilon);
        expect(piece.shape[1].y).toBeCloseTo(-1, epsilon);
        expect(piece.shape[2].x).toBeCloseTo(0, epsilon);
        expect(piece.shape[2].y).toBeCloseTo(0, epsilon);
        expect(piece.shape[3].x).toBeCloseTo(0, epsilon);
        expect(piece.shape[3].y).toBeCloseTo(1, epsilon);
    });

    it("rotates the piece 180", () => {
        piece.rotate180();
        expect(piece.rotation).toBe(RotationState.fliped);
        expect(piece.shape[0].x).toBeCloseTo(1, epsilon);
        expect(piece.shape[0].y).toBeCloseTo(-1, epsilon);
        expect(piece.shape[1].x).toBeCloseTo(1, epsilon);
        expect(piece.shape[1].y).toBeCloseTo(0, epsilon);
        expect(piece.shape[2].x).toBeCloseTo(0, epsilon);
        expect(piece.shape[2].y).toBeCloseTo(0, epsilon);
        expect(piece.shape[3].x).toBeCloseTo(-1, epsilon);
        expect(piece.shape[3].y).toBeCloseTo(0, epsilon);
    });

    it("Can create a copy of a piece", () => {

        const copy: Piece = piece.clone();
        expect(piece).toEqual(copy);

        //Modifying the copy does affect the original piece
        copy.shape[0] = { x: 0, y: 0 };
        expect(piece.shape[0]).toEqual({ x: -1, y: 1 });

    });

    it("Copies a shape", () => {
        const shape = [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }];
        expect(Piece.copyShape(shape)).toEqual(shape);
    });

});