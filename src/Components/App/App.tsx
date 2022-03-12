import './App.css';
import { useState } from 'react';
import { Control } from '../../jenkk/controllers/controller';
import Game from '../Game/Game';
import Menu from '../Menu/Menu';
import Options from '../Options/Options';
import Controls from '../Controls/Controls';
import { ControllerBuilder } from '../../jenkk/builders/controller-builder';
import cookie from 'react-cookies';
import MenuButton from '../MenuButton/MenuButton';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const builder = new ControllerBuilder();
const controlsCookie = cookie.load('controls', true);
let controls: Map<string, Control> | undefined;

if (controlsCookie) {
  controls = ControllerBuilder.importControls(controlsCookie);
}

const controller = builder.build(controls);

let theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontSize: 16
  }
});

theme = responsiveFontSizes(theme);

function App() {

  const [currentMenu, setCurrentMenu] = useState("");

  const setMenu = (menu: string) => {
    return () => {
      if (currentMenu === menu) {
        setCurrentMenu("");
      }
      else {
        setCurrentMenu(menu);
      }
    }
  }

  const paused = (): boolean => {
    return currentMenu !== "";
  }

  const displayGame = (): boolean => {
    return currentMenu === "";
  }

  const displayMenu = (menu: string): boolean => {
    return currentMenu === menu;
  }

  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <Menu children={
      [
        <MenuButton key="controls" onClick={setMenu("controls")} text={"Controls"} />,
        <MenuButton key="options" onClick={setMenu("options")} text={"Options"} />,
      ]
    } />
    <Game paused={paused()} display={displayGame()} controller={controller} />
    {displayMenu("controls") && <Controls controller={controller} />}
    {displayMenu("options") && <Options controller={controller} />}
  </ThemeProvider>;
}

export default App;