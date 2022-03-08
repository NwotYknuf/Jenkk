import './ControlRow.css'
import { Control } from '../../jenkk/controllers/controller';
import Button from '@mui/material/Button';

type ControlRowProps = {
    control: Control;
    keyCode: string;
    onClick: () => void;
}

function ControlRow(props: ControlRowProps) {
    return <div className='control-row'>
        <span className='control-name'>{props.control}</span>
        <span className='control-keycode'>{props.keyCode}</span>
        <Button variant="outlined" disableElevation onClick={props.onClick}>{"Change"}</Button>
    </div>
}

export default ControlRow;