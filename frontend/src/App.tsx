// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useUserStore from './store/userStore';

import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import Header from './components/Header';
import WorkbookPage from './pages/Workbook';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Homepage from './pages/Homepage';
import Pricing from './pages/Pricing';    // make sure this path matches your filename
import WorkbookSessionManager from './hook/WorkbookSessionManager';


export default function App() {
  const user = useUserStore((state) => state.user);
  const { pathname } = useLocation();

  // hide Header on Landing, Authentication, and Pricing pages
  // const hideHeaderOn = ['/', '/authentication', '/pricing'];
  // const showHeader = !hideHeaderOn.includes(pathname);

  const storedUser = localStorage.getItem('user');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  // Show header only if user exists in localStorage
  const showHeader = !!parsedUser;

  return (
    <>
      <WorkbookSessionManager />
      {showHeader && <Header />}

      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/app" replace /> : <LandingPage />}
        />

        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        <Route path="/workbook/:folderName" element={<WorkbookPage />} />

        <Route
          path="/authentication"
          element={!user ? <LoginPage /> : <Navigate to="/app" replace />}
        />

        <Route
          path="/app"
          element={user ? <Homepage /> : <Navigate to="/authentication" replace />}
        />

        {/* Pricing is public but header is hidden */}
        <Route path="/pricing" element={<Pricing />} />

        <Route path="*" element={<Navigate to="/" replace />} />

        <Route
          path="/about"
          element={user ? <LandingPage /> : <Navigate to="/" replace />}
        />
        
      </Routes>

      <ToastContainer />
    </>
  );
}
