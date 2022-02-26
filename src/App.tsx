import './App.css';
import { useState, useEffect } from 'react';
import Queue from "./Components/Queue/Queue";
import Hold from "./Components/Hold/Hold";
import BoardDisplay from "./Components/Board/BoardRender";

import { Board } from './jenkk/board';
import { Piece } from './jenkk/piece';
import { defaultController } from './constants'


defaultController.init();

function App() {

  const [board, setBoard] = useState<Board>(defaultController.boardWithPieceAndGhost);
  const [queue, setQueue] = useState<Piece[]>(defaultController.queue);
  const [heldPiece, setHeldPiece] = useState<Piece | undefined>(defaultController.heldPiece);

  useEffect(() => {
    defaultController.boardState.subscribe({
      update: (board) => {
        setBoard(board);
      }
    });

    defaultController.queueState.subscribe({
      update: (queue) => {
        setQueue(queue);
      }
    });

    defaultController.heldPieceState.subscribe({
      update: (heldPiece) => {
        setHeldPiece(heldPiece);
      }
    });
  }, [])

  useEffect(() => {
    setInterval(() => {
      defaultController.update();
    }, 1 / 120.0);
  }, [board, queue, heldPiece]);

  if (!board) {
    return <></>
  }
  else {
    return <div className='app'>
      <Hold piece={heldPiece}></Hold>
      <BoardDisplay board={board}></BoardDisplay>
      <Queue queue={queue}></Queue>
    </div>
  }
}

export default App;