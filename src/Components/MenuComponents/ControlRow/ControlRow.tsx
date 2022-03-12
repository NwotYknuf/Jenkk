import './ControlRow.css'
import { Control } from '../../../jenkk/controllers/controller';
import Button from '@mui/material/Button';
import { Typography, Box } from '@mui/material';

type ControlRowProps = {
    control: Control;
    keyCode: string;
    onClick: () => void;
}

function ControlRow(props: ControlRowProps) {
    return <div className='control-row'>
        <Typography variant="button">{props.control}</Typography>
        <Box >
            <Typography variant="button">{props.keyCode}</Typography>
            <Box component={"span"} sx={{ mr: "15px" }}></Box>
            <Button variant="outlined" disableElevation onClick={props.onClick}>{"Change"}</Button>
        </Box>
    </div>
}

export default ControlRow;