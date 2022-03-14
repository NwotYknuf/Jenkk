import { Button, Box } from '@mui/material';
import React from 'react';

type FilePickerProp = {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    text: string
};

function FilePicker(props: FilePickerProp) {

    const fileInput = React.useRef<HTMLInputElement | null>(null);

    function showFilePicker() {
        fileInput.current?.click()
    }

    return <Box sx={{ pl: "10px", pr: "10px" }}>
        <input ref={fileInput} style={{ display: 'none' }} id="raised-button-file" type="file" accept='.json' onChange={props.onChange} />
        <label htmlFor="raised-button-file">
            <Button variant="outlined" disableElevation onClick={showFilePicker}>
                {props.text}
            </Button>
        </label>
    </Box>
}

export default FilePicker;