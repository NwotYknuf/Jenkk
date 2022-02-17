import './PieceRenderer.css';
import { Mino } from '../../jenk/mino';
import BoardDisplay from '../Board/BoardRender';
import { Board } from '../../jenk/board';
import { Piece } from '../../jenk/piece';

const getBoardFromPiece = (piece: Piece | undefined, size: number) => {
    const board = new Board(4, 4);

    if (piece) {
        piece.shape.forEach(minoPos => {
            const x = minoPos.x + piece.centerShift + size / 2 - 1;
            const y = minoPos.y + piece.centerShift + size / 2 - 1;
            board.setMino(x, y, new Mino(piece.type));
        });
    }

    return board;
}

function PieceRenderer(props: { piece: Piece | undefined, size: number }) {
    const board = getBoardFromPiece(props.piece, props.size);
    return <BoardDisplay board={board}></BoardDisplay>
}

export default PieceRenderer;