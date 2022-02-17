import { Piece } from '../../jenk/piece';
import PieceDisplay from '../Piece/PieceRenderer';
import './Hold.css'

function Hold(props: { piece: Piece | undefined }) {
    return (<div className='hold'>
        <PieceDisplay piece={props.piece} size={4}></PieceDisplay>
    </div>);
}

export default Hold;