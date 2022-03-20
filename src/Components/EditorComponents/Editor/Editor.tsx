import { Button, Box } from '@mui/material';
import useEditor from '../../../editor-store';
import { GameBuilder } from '../../../jenkk/builders/game-builder';
import { GeneratorBuilder } from '../../../jenkk/builders/generator-builder';
import { MinoType } from '../../../jenkk/mino';
import BoardEditor from '../BoardEditor/BoardEditor';
import GeneratorEditor from '../GeneratorEditor/GeneratorEditor';
import Palette from '../Palette/Palette';
import "./Editor.css";

function getSplitQueue(queue: string) {
    let splitQueue = [];
    for (let i = 0; i < queue.length; i++) {
        const minoType = MinoType[queue[i] as keyof typeof MinoType]
        if (minoType) {
            splitQueue.push({ prototype: minoType });
        }
    }
    return splitQueue
}

function getSplitBag(bag: string) {
    let splitBag = [];
    for (let i = 0; i < bag.length; i++) {
        const minoType = MinoType[bag[i] as keyof typeof MinoType]
        if (minoType) {
            splitBag.push({ prototype: minoType });
        }
    }
    return splitBag;
}

function Editor() {

    const board = useEditor(state => state.board);
    const type = useEditor(state => state.type);
    const bag = useEditor(state => state.bag);
    const queue = useEditor(state => state.queue);
    const subGenerators = useEditor(state => state.subGenerators);

    const exportState = async () => {

        const generatorData = {
            type,
            bag: getSplitBag(bag),
            queue: getSplitQueue(queue),
            generators: subGenerators.map((subGenerator) => ({
                type: subGenerator.type,
                bag: getSplitBag(subGenerator.bag),
                queue: getSplitQueue(subGenerator.queue)
            }))
        }

        const genBuilder = new GeneratorBuilder();
        genBuilder.loadJSON(generatorData);
        const generator = genBuilder.build();

        const builder = new GameBuilder();
        builder.board = board;
        builder.generator = generator;
        const json = JSON.stringify(builder.build().save());
        const blob = new Blob([json], { type: "application/json" });
        const href = await URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = "state.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    return <div className="editor">
        <div>
            <BoardEditor />
            <Palette />
        </div>
        <Box sx={{
            width: "calc(10*var(--cellSize))", margin: "var(--cellSize)",
            display: "flex", flexDirection: "column", gap: "10px",
        }}>
            <GeneratorEditor name="Generator" />
            <Button onClick={exportState} fullWidth>Export game state</Button>
        </Box>
    </div>
}

export default Editor;