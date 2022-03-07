import './Game.css';
import { useState, useEffect } from 'react';
import { ControllerBuilder, Listeners } from '../../jenkk/builders/controller-builder';
import { Piece } from '../../jenkk/piece';
import { Board } from '../../jenkk/board';
import { Controller } from '../../jenkk/controllers/controller';
import Hold from '../../Components/Hold/Hold';
import Queue from '../../Components/Queue/Queue';
import BoardDisplay from '../../Components/Board/BoardRender';
import { Position } from '../../jenkk/position';
import { MinoType } from '../../jenkk/mino';
import cookie from 'react-cookies';

type GameProps = {
    paused: boolean;
}

let controller: Controller;

function Game(props: GameProps) {

    const [board, setBoard] = useState<Board>();
    const [queue, setQueue] = useState<Piece[]>([]);
    const [currentPiece, setCurrentPiece] = useState<Piece | undefined>();
    const [currentPiecePos, setCurrentPiecePos] = useState<Position>(new Position(0, 0));
    const [heldPiece, setHeldPiece] = useState<Piece | undefined>();
    const [lastTimer, setLastTimer] = useState<NodeJS.Timer | undefined>();

    useEffect(() => {
        const builder = new ControllerBuilder();
        const listeners: Listeners = {
            board: [(val) => setBoard(val)],
            held: [(val) => setHeldPiece(val)],
            current: [(val) => setCurrentPiece(val)],
            currentPos: [(val) => setCurrentPiecePos(val)],
            queue: [(val) => setQueue(val)],
            clear: [(val) => console.log(JSON.stringify(val))]
        }
        const controls = cookie.load('controls', true);
        controller = builder.build(listeners, controls);
    }, [])

    useEffect(() => {
        if (lastTimer) {
            clearTimeout(lastTimer);
        }
        if (!props.paused) {
            const timer = setInterval(() => {
                controller.update();
            }, 1 / 120.0)
            setLastTimer(timer);
        }
    }, [props.paused]);

    if (!board || !currentPiece) {
        return <></>
    }
    else {
        const ghost = currentPiece.clone();
        const ghostPos = currentPiecePos.clone();
        while (!board.collision(ghost, ghostPos)) {
            ghostPos.y--;
        };
        ghostPos.y++;
        ghost.type = MinoType.ghost;

        return <div className='game'>
            <Hold piece={heldPiece}></Hold>
            <BoardDisplay board={board.getBoardWithPiece(currentPiece, currentPiecePos, ghost, ghostPos)}></BoardDisplay>
            <Queue queue={queue}></Queue>
        </div>
    }
}

export default Game;