import './App.css';
import { useState } from 'react';
import Game from '../GameComponents/Game/Game';
import Menu from '../MenuComponents/Menu/Menu';
import Options from '../MenuComponents/Options/Options';
import Controls from '../MenuComponents/Controls/Controls';
import MenuButton from '../MenuComponents/MenuButton/MenuButton';
import { ControllerBuilder } from '../../jenkk/builders/controller-builder';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { importControls, importOptions } from '../../cookies';

const builder = new ControllerBuilder();
const controls = importControls();
const options = importOptions();

if (controls) {
  builder.controls = controls;
}

if (options) {
  builder.options = options;
}

const controller = builder.build();

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