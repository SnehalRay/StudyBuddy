// src/components/Header.tsx
import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { AppBar, Toolbar, Typography, Box, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../theme/ColorModeContext';
import Avatar from '@mui/material/Avatar';
import ProfilePopup from './ProfilePopup';
import { useState } from 'react';


// Styled Button for navigation
const LinkButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const user = JSON.parse(localStorage.getItem('user') || '{}');
const name = user?.name || '';
const initials = name
  .split(' ')
  .map((n) => n[0])
  .join('')
  .toUpperCase();




export default function Header() {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const isDark = theme.palette.mode === 'dark';

  const [isProfileOpen, setIsProfileOpen] = useState(false);


  return (
    <>
      <CssBaseline />
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{
          // gradient background for light and dark modes
          background: isDark
            ? 'linear-gradient(135deg, #7b1fa2 0%, #0d47a1 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #2196f3 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton edge="start" color="inherit" onClick={() => { /* open menu */ }}>
              <MenuIcon />
            </IconButton>
            <LinkButton href="/">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Study<span style={{ fontWeight: 300 }}>Buddy</span>
              </Typography>
            </LinkButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <LinkButton href="/pricing">
              Pricing
            </LinkButton>
            <IconButton onClick={() => setIsProfileOpen(true)}>
              <Avatar alt={name}>{initials}</Avatar>
            </IconButton>
            <ProfilePopup open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
