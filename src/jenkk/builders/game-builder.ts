import { Game } from "../controllers/game"
import { Position } from "../position";
import { BoardBuilder } from "./board-builder";
import { GeneratorBuilder } from "./generator-builder";
import { RotationSystemBuilder } from "./rotation-system-builder";

class GameBuilder {

    test(): Game {
        const boardBuilder = new BoardBuilder();
        const generatorBuilder = new GeneratorBuilder();
        const rotationSystemBuilder = new RotationSystemBuilder();

        const board = boardBuilder.empty(10, 20);
        const generator = generatorBuilder.testSevenBag();
        const rotationSystem = rotationSystemBuilder.superRotationSystem();
        const spawnPos = new Position(4, 17);
        const nbPreviewPieces = 5;

        return new Game(
            generator,
            rotationSystem,
            spawnPos,
            nbPreviewPieces,
            board,
            undefined,
            undefined
        );
    }

    default(): Game {

        const boardBuilder = new BoardBuilder();
        const generatorBuilder = new GeneratorBuilder();
        const rotationSystemBuilder = new RotationSystemBuilder();

        const board = boardBuilder.empty(10, 20);
        const generator = generatorBuilder.sevenBag();
        const rotationSystem = rotationSystemBuilder.superRotationSystem();
        const spawnPos = new Position(4, 17);
        const nbPreviewPieces = 5;

        return new Game(
            generator,
            rotationSystem,
            spawnPos,
            nbPreviewPieces,
            board,
            undefined,
            undefined
        );

    }
}

export { GameBuilder }