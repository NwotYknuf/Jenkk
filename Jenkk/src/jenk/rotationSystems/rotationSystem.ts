import { Board } from '../board';
import { Piece } from '../piece';

type RotationFunction = () => void;

abstract class RotationSystem {

    public abstract rotateCW(board: Board, piece: Piece): [boolean, Piece];
    public abstract rotateCCW(board: Board, piece: Piece): [boolean, Piece];
    public abstract rotate180(board: Board, piece: Piece): [boolean, Piece];

}

export { RotationSystem, type RotationFunction }