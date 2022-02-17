import './App.css';
import { useState, useEffect } from 'react';
import Queue from "./Components/Queue/Queue";
import Hold from "./Components/Hold/Hold";
import BoardDisplay from "./Components/Board/BoardRender";

import { Board } from './jenkk/board';
import { Piece } from './jenkk/piece';
import { defaultController } from './constants'

let gameInfo = defaultController.init();

function App() {

  const [board, setBoard] = useState<Board>(gameInfo.board.value);
  const [queue, setQueue] = useState<Piece[]>(gameInfo.queue.value);
  const [heldPiece, setHeldPiece] = useState<Piece | undefined>(gameInfo.held.value);

  useEffect(() => {
    setInterval(() => {
      gameInfo = defaultController.update();
      if (gameInfo.board.updated) {
        setBoard(gameInfo.board.value);
      }
      if (gameInfo.queue.updated) {
        setQueue(gameInfo.queue.value);
      }
      if (gameInfo.held.updated) {
        setHeldPiece(gameInfo.held.value);
      }
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