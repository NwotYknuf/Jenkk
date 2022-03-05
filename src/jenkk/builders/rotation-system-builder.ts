import { RotationState } from "../piece";
import { Kick, KickTable, SRS } from "../rotationSystems/srs";

class RotationSystemBuilder {

    superRotationSystem() {

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

        return new SRS(SRS_Kicks, I_SRS_Kicks);
    }

}

export { RotationSystemBuilder }