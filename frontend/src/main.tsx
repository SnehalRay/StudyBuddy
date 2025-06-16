import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import ReactDOM from "react-dom/client"
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { ColorModeProvider } from './theme/ColorModeContext.tsx'
import { RecoilRoot } from 'recoil';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
    <BrowserRouter>
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </BrowserRouter>
    </RecoilRoot>
  </StrictMode>,
)
