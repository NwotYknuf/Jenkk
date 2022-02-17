import { Board } from '../../jenkk/board';
import Col from '../Col/Col'
import './BoardRender.css'

function BoardRender(props: { board: Board }) {
    return (<div className="board">
        {props.board.minos.map((val, index) => {
            return <Col col={val} key={index}></Col>;
        })}
    </div>);
}

export default BoardRender;