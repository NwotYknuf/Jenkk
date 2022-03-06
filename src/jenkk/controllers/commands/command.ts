import { Game } from "../game";

abstract class Command {

    constructor(protected game: Game) { }

    abstract execute(): boolean

    abstract undo(): void

}

export { Command }