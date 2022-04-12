import './Game.css';
import { useState, useEffect } from 'react';
import { Listeners } from '../../../jenkk/builders/controller-builder';
import Hold from '../Hold/Hold';
import Queue from '../Queue/Queue';
import BoardDisplay from '../Board/BoardRender';
import { Piece } from '../../../jenkk/piece';
import { Board } from '../../../jenkk/board';
import { Controller } from '../../../jenkk/controllers/controller';
import { Position } from '../../../jenkk/position';
import { MinoType } from '../../../jenkk/mino';
import { ObservableGame as JenkkGame } from '../../../jenkk/controllers/observable-game';

type GameProps = {
    paused: boolean,
    display: boolean
    controller: Controller
}

function setListeners(game: JenkkGame, listeners: Listeners) {
    listeners.board.forEach(listener => {
        game.addBoardWatcher(listener);
    });

    listeners.queue.forEach(listener => {
        game.addQueueWatcher(listener);
    });

    listeners.current.forEach(listener => {
        game.addCurrentPieceWatcher(listener);
    });

    listeners.currentPos.forEach(listener => {
        game.addCurrentPiecePosWatcher(listener);
    });

    listeners.held.forEach(listener => {
        game.addHeldWatcher(listener);
    });

    listeners.clear.forEach(listener => {
        game.addClearWatcher(listener);
    });
}

function Game(props: GameProps) {

    const [board, setBoard] = useState<Board>();
    const [queue, setQueue] = useState<Piece[]>([]);
    const [currentPiece, setCurrentPiece] = useState<Piece | undefined>();
    const [currentPiecePos, setCurrentPiecePos] = useState<Position>(new Position(0, 0));
    const [heldPiece, setHeldPiece] = useState<Piece | undefined>();
    const [lastTimer, setLastTimer] = useState<NodeJS.Timer | undefined>();

    const controller = props.controller;

    useEffect(() => {
        const listeners: Listeners = {
            board: [(val) => setBoard(val)],
            held: [(val) => setHeldPiece(val)],
            current: [(val) => setCurrentPiece(val)],
            currentPos: [(val) => setCurrentPiecePos(val)],
            queue: [(val) => setQueue(val)],
            clear: [(val) => console.log(JSON.stringify(val))]
        }
        setListeners(controller.game, listeners);
        controller.init();
        //Suppressing this warning since i don't want the effect to run when controller is updated
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (lastTimer) {
            clearTimeout(lastTimer);
        }
        if (!props.paused) {
            controller.addListeners();
            const timer = setInterval(() => {
                controller.update();
            }, 1)
            setLastTimer(timer);
        }
        else {
            controller.removeListeners();
        }
        //Suppressing this warning since i don't want the effect to run when controller or lastTimer are updated
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

        return <div style={{ display: props.display ? 'flex' : 'none' }} className='game'>
            <Hold piece={heldPiece}></Hold>
            <BoardDisplay board={board.getBoardWithPiece(currentPiece, currentPiecePos, ghost, ghostPos)}></BoardDisplay>
            <Queue queue={queue}></Queue>
        </div>
    }
}

export default Game;