import './App.css';
import { useState } from 'react';
import { Control } from './jenkk/controllers/controller';
import ControlRow from './Components/ControlRow/ControlRow';
import Game from './Components/Game/Game';
import Menu from './Components/Menu/Menu';
import Button from '@mui/material/Button';

function App() {

  const [displayControls, setDisplayControls] = useState(false);

  const toggleControls = () => {
    setDisplayControls(!displayControls);
  }

  const log = () => {
    console.log("slt");
  }

  return <>
    <Menu children={
      [<Button variant="outlined" disableElevation onClick={toggleControls}>Controls</Button>]
    } />
    <div style={{ display: displayControls ? 'none' : 'block' }}>
      <Game paused={displayControls} />
    </div>
    <div style={{ display: !displayControls ? 'none' : 'block' }}>
      <ControlRow control={Control.left} onclick={log} ></ControlRow>
      <ControlRow control={Control.left} onclick={log} ></ControlRow>
      <ControlRow control={Control.left} onclick={log} ></ControlRow>
      <ControlRow control={Control.left} onclick={log} ></ControlRow>
      <ControlRow control={Control.left} onclick={log} ></ControlRow>
    </div>
  </>;
}

export default App;