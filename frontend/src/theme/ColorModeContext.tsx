// src/theme/ColorModeContext.tsx
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { getDesignTokens } from './theme';

// Context type
type ColorModeContextType = {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
};

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  // Read initial mode from localStorage (fallback to system preference or 'light')
  const getInitialMode = (): 'light' | 'dark' => {
    const stored = window.localStorage.getItem('color-mode');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // optional: detect system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode);

  // Persist mode to localStorage whenever it changes
  useEffect(() => {
    window.localStorage.setItem('color-mode', mode);
  }, [mode]);

  // Toggle between light and dark
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prev => (prev === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  // Memoize theme object
  const theme = useMemo(
    () => createTheme(getDesignTokens(mode)),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
