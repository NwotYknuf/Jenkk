import { InputLabel, MenuItem, FormControl, List, TextField, Button, } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { GeneratorType } from '../../../jenkk/builders/generator-builder';
import SubGeneratorEditor from '../SubGeneratorEditor/SubGeneratorEditor';
import useEditor from '../../../editor-store';

type GeneratorEditorProp = {
    name: string
};

function GeneratorEditor(props: GeneratorEditorProp) {

    const type = useEditor(state => state.type);
    const bag = useEditor(state => state.bag);
    const queue = useEditor(state => state.queue);
    const subGenerators = useEditor(state => state.subGenerators);
    const setType = useEditor(state => state.setType);
    const setBag = useEditor(state => state.setBag);
    const setQueue = useEditor(state => state.setQueue);
    const addGenerator = useEditor(state => state.addGenerator);

    const handleType = (event: SelectChangeEvent<GeneratorType>) => {
        const type = GeneratorType[event.target.value as keyof typeof GeneratorType];
        setType(type);
    }

    const handleBag = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBag(event.target.value);
    }

    const handleQueue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQueue(event.target.value);
    }

    return <FormControl fullWidth sx={{ gap: "10px" }}>
        <InputLabel id="type-label">Generator type</InputLabel>
        <Select labelId="type-label" id="type" label="Generator type" onChange={handleType} value={type}>
            {Object.keys(GeneratorType).map((enumKey) => {
                const key = enumKey as keyof typeof GeneratorType;
                return <MenuItem value={key} key={GeneratorType[key]}>{GeneratorType[key]}</MenuItem>
            })}
        </Select>
        {type === GeneratorType.Sequence && <TextField label="queue"
            size="small" onChange={handleQueue} value={queue} />}
        {(type === GeneratorType.InfiniteBag || type === GeneratorType.Bag) && <TextField label="bag"
            size="small" onChange={handleBag} value={bag} />}
        {type === GeneratorType.Composite && <>
            <List sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {subGenerators.map((_, index) => {
                    return <SubGeneratorEditor name={`Sub Generator ${index + 1}`} index={index} key={index} />
                })}
            </List>
            <Button onClick={addGenerator} fullWidth>Add a generator</Button>
        </>
        }
    </FormControl>
}

export default GeneratorEditor;