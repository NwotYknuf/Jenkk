import { useState } from "react";
import useEditor from '../../../editor-store';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Delete from '@mui/icons-material/Delete';
import { Box, ListItemText, Collapse, ListItemButton, IconButton, FormControl, InputLabel, MenuItem, TextField } from '@mui/material'
import { GeneratorType } from "../../../jenkk/builders/generator-builder";
type SubGeneratorEditorProp = {
    name: string,
    index: number
};

function SubGeneratorEditor(props: SubGeneratorEditorProp) {

    const [expanded, setExpanded] = useState(true);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    }

    const subGenerators = useEditor(state => state.subGenerators);
    const removeGenerator = useEditor(state => state.removeGenerator);
    const setSubGeneratorType = useEditor(state => state.setSubGeneratorType);
    const setSubGeneratorBag = useEditor(state => state.setSubGeneratorBag);
    const setSubGeneratorQueue = useEditor(state => state.setSubGeneratorQueue);

    const handleType = (event: SelectChangeEvent<GeneratorType>) => {
        const type = GeneratorType[event.target.value as keyof typeof GeneratorType];
        setSubGeneratorType(props.index, type);
    }

    const handleBag = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubGeneratorBag(props.index, event.target.value);
    }

    const handleQueue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubGeneratorQueue(props.index, event.target.value);
    }

    const subGenerator = subGenerators[props.index];

    return <Box>
        <ListItemButton onClick={handleExpandClick}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
            <ListItemText primary={props.name} />
            <IconButton onClick={() => { removeGenerator(props.index) }}>
                <Delete />
            </IconButton>
        </ListItemButton>
        <Collapse in={expanded} timeout="auto">
            <FormControl fullWidth sx={{ gap: "10px" }} >
                <InputLabel id="type-label">Type</InputLabel>
                <Select labelId="type-label" id="type" label="Type" onChange={handleType} value={subGenerator.type}>
                    {Object.keys(GeneratorType).filter((val) => val !== GeneratorType.Composite).map((enumKey) => {
                        const key = enumKey as keyof typeof GeneratorType;
                        return <MenuItem value={key} key={GeneratorType[key]}>{GeneratorType[key]}</MenuItem>
                    })}
                </Select>
                {subGenerator.type === GeneratorType.Sequence && <TextField label="queue" size="small" value={subGenerator.queue} onChange={handleQueue} />}
                {(subGenerator.type === GeneratorType.InfiniteBag || subGenerator.type === GeneratorType.Bag) && <TextField label="bag" size="small" value={subGenerator.bag} onChange={handleBag} />}
            </FormControl>
        </Collapse>
    </Box >
}

export default SubGeneratorEditor;