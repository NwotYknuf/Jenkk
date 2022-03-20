import create from 'zustand';
import { Board } from './jenkk/board';
import { BoardBuilder } from './jenkk/builders/board-builder';
import { GeneratorType } from './jenkk/builders/generator-builder';
import { Mino, MinoType } from './jenkk/mino';

const useEditor = create<{
    board: Board,
    setMino: (x: number, y: number, mino: Mino) => void,

    selectedMinoType: MinoType,
    setSelectedMinoType: (type: MinoType) => void,

    type: GeneratorType,
    setType: (type: GeneratorType) => void,

    bag: string,
    setBag: (bag: string) => void,

    queue: string,
    setQueue: (queue: string) => void,

    subGenerators: {
        type: GeneratorType,
        bag: string,
        queue: string,
    }[],
    addGenerator: () => void,
    removeGenerator: (index: number) => void,
    setSubGeneratorType: (index: number, type: GeneratorType) => void,
    setSubGeneratorBag: (index: number, bag: string) => void,
    setSubGeneratorQueue: (index: number, queue: string) => void,

}>(set => ({
    board: new BoardBuilder().build(),
    setMino: (x: number, y: number, mino: Mino) => set(state => {
        const newBoard = state.board.clone();
        newBoard.setMino(x, y, mino);
        return ({
            board: newBoard
        })
    }),

    selectedMinoType: MinoType.I,
    setSelectedMinoType: (type: MinoType) => set({ selectedMinoType: type }),


    type: GeneratorType.Sequence,
    setType: (type: GeneratorType) => set({ type }),

    bag: "",
    setBag: (bag: string) => set({ bag }),

    queue: "",
    setQueue: (queue: string) => set({ queue }),

    subGenerators: [],
    addGenerator: () => set(state => {
        const newGenerators = state.subGenerators.map((generator) => {
            return generator;
        })

        newGenerators.push({
            type: GeneratorType.Sequence,
            bag: "",
            queue: ""
        });

        return ({
            subGenerators: newGenerators
        })
    }),
    removeGenerator: (index: number) => set(state => {
        const newGenerators = state.subGenerators.map((generator) => {
            return generator;
        })
        newGenerators.splice(index, 1);
        return ({
            subGenerators: newGenerators
        })
    }),
    setSubGeneratorType: (index: number, type: GeneratorType) => set(state => {
        const newGenerators = state.subGenerators.map((generator) => {
            return generator;
        })
        newGenerators[index].type = type;
        return ({
            subGenerators: newGenerators
        })
    }),
    setSubGeneratorBag: (index: number, bag: string) => set(state => {
        const newGenerators = state.subGenerators.map((generator) => {
            return generator;
        })
        newGenerators[index].bag = bag;
        return ({
            subGenerators: newGenerators
        })
    }),
    setSubGeneratorQueue: (index: number, queue: string) => set(state => {
        const newGenerators = state.subGenerators.map((generator) => {
            return generator;
        })
        newGenerators[index].queue = queue;
        return ({
            subGenerators: newGenerators
        })
    }),
}));

export default useEditor;