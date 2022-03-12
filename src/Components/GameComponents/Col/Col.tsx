import React from "react";
import { Mino } from "../../../jenkk/mino";
import Cell from "../Cell/Cell";
import './Col.css';

type ColProp = { col: Mino[] }

const Col = React.memo(
    (props: ColProp) => {
        return (<div className='col'>
            {props.col.map((_, index, array) => {
                return <Cell mino={array[array.length - 1 - index]} key={array.length - 1 - index}></Cell>
            })}
        </div>);
    },
    (prevProps: ColProp, nextProps: ColProp) => {
        return prevProps.col.every((val, index) => val.type === nextProps.col[index].type)
    }
)

export default Col;