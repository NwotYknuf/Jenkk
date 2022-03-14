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
import FilePicker from '../MenuComponents/FilePickerButton/FilePickerButton';
import { GameBuilder } from '../../jenkk/builders/game-builder';

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

  const load = (event: React.ChangeEvent<HTMLInputElement>) => {

    const setState = (json: any) => {
      const builder = new GameBuilder();
      builder.loadJSON(json);
      const game = builder.build();
      const snapshot = game.save();
      controller.initialState = snapshot;
    }

    if (window.File && window.FileReader && window.FileList && window.Blob) {
      if (event.target.files) {
        const file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
          if (evt.target && evt.target.result) {
            setState(JSON.parse(evt.target.result as string));
          }
        };
        reader.onerror = function (evt) {
          console.error("An error ocurred reading the file", evt);
        };
        reader.readAsText(file, "UTF-8");
      }
    } else {
      alert('The File APIs are not fully supported by your browser.');
    }
  }

  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <Menu children={
      [
        <MenuButton key="controls" onClick={setMenu("controls")} text={"Controls"} />,
        <MenuButton key="options" onClick={setMenu("options")} text={"Options"} />,
        //<FilePicker key="load" onChange={load} text={"Load GameState"} />,
      ]
    } />
    <Game paused={paused()} display={displayGame()} controller={controller} />
    {displayMenu("controls") && <Controls controller={controller} />}
    {displayMenu("options") && <Options controller={controller} />}
  </ThemeProvider>;
}

export default App;