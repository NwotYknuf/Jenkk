import './Queue.css'
import PieceDisplay from "../Piece/PieceRenderer";
import { Piece } from '../../../jenkk/piece';

function Queue(props: { queue: Piece[] }) {
    return <div className='queue'>{
        props.queue.map((piece, index) => {
            return <PieceDisplay piece={piece} size={4} key={index}></PieceDisplay>
        })
    }</div>;
}

export default Queue;