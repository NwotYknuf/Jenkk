import './App.css';
import { useState } from 'react';
import { Control } from './jenkk/controllers/controller';
import ControlRow from './Components/ControlRow/ControlRow';
import Game from './Components/Game/Game';
import Menu from './Components/Menu/Menu';
import Button from '@mui/material/Button';
import { ControllerBuilder } from './jenkk/builders/controller-builder';
import cookie from 'react-cookies';
import Controls from './Components/Controls/Controls';

const builder = new ControllerBuilder();
const controlsCookie = cookie.load('controls', true);
let controls: Map<string, Control> | undefined;

if (controlsCookie) {
  controls = ControllerBuilder.importControls(controlsCookie);
}

const controller = builder.build(undefined, controls);

function App() {

  const [displayControls, setDisplayControls] = useState(false);
  const [displayGame, setDisplayGame] = useState(true);
  const [pauseGame, setPauseGame] = useState(false);


  const toggleControls = () => {
    const display = !displayControls;
    setDisplayControls(display);
    setDisplayGame(!display);
    setPauseGame(display);
  }

  return <>
    <Menu children={
      [<Button key="controls" variant="outlined" disableElevation onClick={toggleControls}>Controls</Button>]
    } />
    <Game paused={pauseGame} display={displayGame} controller={controller} />
    {displayControls && <Controls controller={controller} />}
  </>;
}

export default App;