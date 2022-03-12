import "./NumberField.css"
import { TextField, Typography } from "@mui/material";

type NumberFieldProp = {
    text: string;
    defaultValue: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function NumberField(props: NumberFieldProp) {
    return <div className="number-field">
        <Typography variant="button">{props.text}</Typography>
        <TextField style={{ width: "4rem" }} defaultValue={props.defaultValue} size="small" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={props.onChange} />
    </div>
}

export default NumberField;