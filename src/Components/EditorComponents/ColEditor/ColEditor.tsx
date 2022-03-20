import React from "react";
import { Mino } from "../../../jenkk/mino";
import CellEditor from "../CellEditor/CellEditor";
import '../../GameComponents/Col/Col.css';

type ColEditorProps = {
    col: Mino[]
    x: number
}

function ColEditor(props: ColEditorProps) {
    return (<div className='col'>
        {props.col.map((_, index, array) => {
            const y = array.length - 1 - index;
            return <CellEditor mino={array[y]} x={props.x} y={y} key={y}></CellEditor>
        })}
    </div>);
}

export default ColEditor;