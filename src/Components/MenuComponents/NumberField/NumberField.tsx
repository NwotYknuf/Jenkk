import "./NumberField.css"
import { TextField, Typography, Box } from "@mui/material";

type NumberFieldProp = {
    text: string,
    defaultValue: number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    error: boolean,
    errorText: string
}

function NumberField(props: NumberFieldProp) {
    return <Box sx={{ mb: "5px" }}>
        <div className="number-field">
            <Typography variant="button">{props.text}</Typography>
            <TextField style={{ width: "4rem" }} defaultValue={props.defaultValue} size="small" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={props.onChange} />
        </div>
        <Box sx={{ width: 400 }}>
            {props.error && <Typography style={{ color: '#f44336' }} align="right" >{props.errorText}</Typography>}
        </Box>
    </Box>
}

export default NumberField;