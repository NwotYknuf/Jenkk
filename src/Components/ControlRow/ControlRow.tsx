import './ControlRow.css'
import { Control } from '../../jenkk/controllers/controller';
import Button from '@mui/material/Button';

type ControlRowProps = {
    control: Control;
    onclick: () => void;
}

function ControlRow(props: ControlRowProps) {
    return <div className='control-row'>
        <span>{props.control}</span> <Button variant="outlined" disableElevation onClick={props.onclick}>change</Button>
    </div>
}

export default ControlRow;