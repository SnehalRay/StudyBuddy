
import React, { useState } from 'react';
import HomePage from '@/components/HomePage';
import AuthPage from '@/components/AuthPage';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'auth'>('home');

  const handleNavigateToAuth = () => {
    setCurrentView('auth');
  };

  const handleNavigateToHome = () => {
    setCurrentView('home');
  };

  return (
    <>
      {currentView === 'home' && (
        <HomePage onNavigateToAuth={handleNavigateToAuth} />
      )}
      {currentView === 'auth' && (
        <AuthPage onBack={handleNavigateToHome} />
      )}
    </>
  );
};

export default Index;
