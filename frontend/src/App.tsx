
import LoginPage from "./pages/LoginPage"
import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Prices from './pages/Pricing';
import { ToastContainer } from "react-toastify";
import { useRecoilValue } from "recoil";
import useUserStore from "./store/userStore";


export default function App() {
  const user = useUserStore((state) => state.user);
  

  return (
    <>
      {/* <LoginPage /> */}
      <Routes>
        <Route path="/" element={user ? <Prices/> : <Navigate to="/authentication"/>}/>
        <Route path="/authentication" element={!user ? <LoginPage/> : <Navigate to="/"/>}/>
      </Routes>
      <ToastContainer/>
    </>
 
  );
}