import React from "react";
import './App.css';
import Terminal from "./components/Terminal";
import {ThemeProvider} from "styled-components";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Terminal />
    </ThemeProvider>
  )
}

export default App;
