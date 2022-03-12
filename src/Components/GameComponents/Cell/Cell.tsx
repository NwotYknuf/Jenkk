import './Cell.css';
import { Mino, MinoType } from '../../../jenkk/mino';
import React from 'react';

const colors: Map<MinoType, string> = new Map<MinoType, string>([
    [MinoType.empty, 'black'],
    [MinoType.Z, 'red'],
    [MinoType.S, 'green'],
    [MinoType.L, 'orange'],
    [MinoType.J, 'blue'],
    [MinoType.I, 'cyan'],
    [MinoType.O, 'yellow'],
    [MinoType.T, 'purple'],
    [MinoType.ghost, 'ghost']
]);

type CellProp = { mino: Mino };

const Cell = React.memo(
    (props: CellProp) => {
        return (<div className={`cell ${colors.get(props.mino.type)}`}></div>);
    },
    (prevProps: CellProp, nextProps: CellProp) => {
        return prevProps.mino.type === nextProps.mino.type;
    }
);

export default Cell;