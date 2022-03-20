import useEditor from '../../../editor-store';
import { Mino, MinoType } from '../../../jenkk/mino';
import Cell from '../../GameComponents/Cell/Cell';
import "./Palette.css"

const availableColors = [
    MinoType.I,
    MinoType.J,
    MinoType.L,
    MinoType.O,
    MinoType.S,
    MinoType.T,
    MinoType.Z,
    MinoType.garbage,
    MinoType.empty
]

function Palette() {

    const setSelectedMinoType = useEditor(state => state.setSelectedMinoType);

    const handler = (type: MinoType) => {
        return () => {
            setSelectedMinoType(type);
        }
    }

    return <div className="palette">
        {availableColors.map((type) => {
            return <div onClick={handler(type)} key={type}>
                <Cell mino={new Mino(type)} />
            </div>
        })}
    </div>
}

export default Palette;