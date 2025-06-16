// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Prices from './pages/Pricing';
//import Home    from './pages/Home';   // you can stub this for now

const lightTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Prices />
    </ThemeProvider>
  );
}