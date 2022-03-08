import './App.css';
import { useState } from 'react';
import { Control } from './jenkk/controllers/controller';
import ControlRow from './Components/ControlRow/ControlRow';
import Game from './Components/Game/Game';
import Menu from './Components/Menu/Menu';
import Button from '@mui/material/Button';
import { ControllerBuilder } from './jenkk/builders/controller-builder';
import cookie from 'react-cookies';

const builder = new ControllerBuilder();
const controlsCookie = cookie.load('controls', true);
let controls: Map<string, Control> | undefined;

if (controlsCookie) {
  controls = ControllerBuilder.importControls(controlsCookie);
}

const controller = builder.build(undefined, controls);

function App() {

  const [displayControls, setDisplayControls] = useState(false);
  const [waitingForKey, setWaitingForKey] = useState(false);

  const toggleControls = () => {
    setDisplayControls(!displayControls);
  }

  function changeKey(control: Control) {
    return () => {
      setWaitingForKey(true);

      const handler = (event: KeyboardEvent): void => {
        if (event.code) {
          controller.setControl(control, event.code);
          const savedControls = ControllerBuilder.exportControls(controller.controls)
          cookie.save('controls', savedControls, {});
          setWaitingForKey(false);
          window.removeEventListener('keydown', handler);
        }
      }
      window.addEventListener('keydown', handler);
    }
  }

  return <>
    <Menu children={
      [<Button key="controls" variant="outlined" disableElevation onClick={toggleControls}>Controls</Button>]
    } />
    <div style={{ display: displayControls ? 'none' : 'block' }}>
      <Game paused={displayControls} controller={controller} />
    </div>
    {
      displayControls && <div className="controls-container">
        {(Object.keys(Control) as (keyof typeof Control)[]).map((_control, key) => {
          const control = Control[_control];
          const keyCode = controller.getKeyCode(control);
          return <ControlRow control={control} keyCode={keyCode} onClick={changeKey(control)} key={key} ></ControlRow>
        })}
      </div>
    }
    {waitingForKey && <div className="press-a-key">Press a key</div>}
  </>;
}

export default App;