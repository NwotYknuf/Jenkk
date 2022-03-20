import '../../GameComponents/Cell/Cell.css';
import { Mino, MinoType } from '../../../jenkk/mino';
import Cell from '../../GameComponents/Cell/Cell';
import useEditor from '../../../editor-store';

type CellEditorProps = {
    mino: Mino
    x: number,
    y: number
};

function CellEditor(props: CellEditorProps) {

    const setMino = useEditor(state => state.setMino);
    const selectedMinoType = useEditor(state => state.selectedMinoType);

    const handler = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        if ((event.type === "mouseenter" && event.buttons === 1) || event.type === "mousedown") {
            setMino(props.x, props.y, new Mino(selectedMinoType));
        }
    }

    return <div onMouseEnter={handler} onMouseDown={handler}>
        <Cell mino={props.mino} />
    </div>
}

export default CellEditor;