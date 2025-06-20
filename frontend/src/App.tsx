// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Prices from './pages/Pricing';
import { useRecoilValue } from "recoil";
import useUserStore from "./store/userStore";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler";
import Header from './components/Header';

import LoginPage from './pages/LoginPage';
import Homepage from './pages/Homepage';
import Pricing from './pages/Pricing';
// import Account from './pages/Account'; // under development

export default function App() {
  const user = useUserStore((state) => state.user);
  const { pathname } = useLocation();

  // don’t show header on the authentication screen
  const showHeader = pathname !== '/authentication';

  return (
    <>
      {showHeader && <Header />}

      <Routes>
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
        <Route
          path="/authentication"
          element={
            !user
              ? <LoginPage />
              : <Navigate to="/" replace />
          }
        />

        <Route
          path="/"
          element={
            user
              ? <Homepage />
              : <Navigate to="/authentication" replace />
          }
        />

        <Route
          path="/pricing"
          element={
            user
              ? <Pricing />
              : <Navigate to="/authentication" replace />
          }
        />

        {/* <Route ...account stub for future content... /> */}
      </Routes>

      <ToastContainer />
    </>
  );
}
