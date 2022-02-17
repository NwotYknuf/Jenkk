import { Board } from "./jenk/board";
import { Controller } from "./jenk/controllers/controller";
import { GameState } from "./jenk/gameState";
import { BagGenerator } from "./jenk/generators/bagGenerator";
import { Generator } from "./jenk/generators/generator";
import { LCG } from "./jenk/generators/LCG";
import { InputController } from "./jenk/inputController";
import { MinoType } from "./jenk/mino";
import { Piece, RotationState } from "./jenk/piece";
import { Kick, KickTable, SRS } from "./jenk/rotationSystems/srs";

const SRS_Kicks: KickTable = new Map<RotationState, Map<RotationState, Kick[]>>([
    [RotationState.flat, new Map<RotationState, Kick[]>([
        [RotationState.right, [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }]],//CW
        [RotationState.left, [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }]], //CCW
        [RotationState.fliped, [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: 0 }, { x: -1, y: 0 }]],//180
    ])],
    [RotationState.right, new Map<RotationState, Kick[]>([
        [RotationState.fliped, [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }]], //CW
        [RotationState.flat, [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }]], //CCW
        [RotationState.left, [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 2 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 1 }]], //180
    ])],
    [RotationState.fliped, new Map<RotationState, Kick[]>([
        [RotationState.left, [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }]], //CW
        [RotationState.right, [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }]], //CCW
        [RotationState.flat, [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: -1, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }]], //180
    ])],
    [RotationState.left, new Map<RotationState, Kick[]>([
        [RotationState.flat, [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }]], //CW
        [RotationState.fliped, [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }]], //CCW
        [RotationState.right, [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 2 }, { x: -1, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 1 }]], //180
    ])],
]);

const I_SRS_Kicks: KickTable = new Map<RotationState, Map<RotationState, Kick[]>>([
    [RotationState.flat, new Map<RotationState, Kick[]>([
        [RotationState.right, [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }]], //CW
        [RotationState.left, [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }]], //CCW
        [RotationState.fliped, [{ x: 0, y: 0 }]],//180
    ])],
    [RotationState.right, new Map<RotationState, Kick[]>([
        [RotationState.fliped, [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }]], //CW
        [RotationState.flat, [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }]], //CCW
        [RotationState.left, [{ x: 0, y: 0 }]],//180
    ])],
    [RotationState.fliped, new Map<RotationState, Kick[]>([
        [RotationState.left, [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }]], //CW
        [RotationState.right, [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }]], //CCW
        [RotationState.flat, [{ x: 0, y: 0 }]],//180
    ])],
    [RotationState.left, new Map<RotationState, Kick[]>([
        [RotationState.flat, [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }]], //CW
        [RotationState.fliped, [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }]], //CCW
        [RotationState.right, [{ x: 0, y: 0 }]],//180
    ])]
]);

const sevenBag: Piece[] = [
    new Piece(0, 0, 0, RotationState.flat, MinoType.Z, [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }]),
    new Piece(0, 0, 0, RotationState.flat, MinoType.S, [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]),
    new Piece(0, 0, 0, RotationState.flat, MinoType.J, [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]),
    new Piece(0, 0, 0, RotationState.flat, MinoType.L, [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }]),
    new Piece(0, 0, 0.5, RotationState.flat, MinoType.O, [{ x: -0.5, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: -0.5, y: -0.5 }, { x: 0.5, y: -0.5 }]),
    new Piece(0, 0, 0.5, RotationState.flat, MinoType.I, [{ x: -1.5, y: 0.5 }, { x: -0.5, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 1.5, y: 0.5 }]),
    new Piece(0, 0, 0, RotationState.flat, MinoType.T, [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }])
];

const sevenBagGenerator: BagGenerator = new BagGenerator(
    4, 17, 5, [],
    Generator.cloneQueue(sevenBag),
    new LCG(1)
);

const defaultController = new Controller(
    new InputController(),
    new GameState(
        new Board(10, 20),
        sevenBagGenerator.clone(),
    ),
    new SRS(SRS_Kicks, I_SRS_Kicks)
);

export { SRS_Kicks, I_SRS_Kicks, sevenBag, defaultController }