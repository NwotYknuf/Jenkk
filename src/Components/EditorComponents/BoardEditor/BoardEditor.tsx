import ColEditor from '../ColEditor/ColEditor';
import '../../GameComponents/Board/BoardRender.css';
import useEditor from '../../../editor-store';

type BoardEditorProps = {

}

function BoardEditor(props: BoardEditorProps) {

    const board = useEditor(state => state.board);

    return (<div className="board">
        {board.minos.map((val, index) => {
            return <ColEditor col={val} x={index} key={index} />;
        })}
    </div>);
}

export default BoardEditor;