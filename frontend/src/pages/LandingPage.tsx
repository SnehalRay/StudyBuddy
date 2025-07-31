// src/pages/LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  CssBaseline,
} from '@mui/material';
import {
  VideoLibrary,
  Person,
  SmartToy,
  EmojiEmotions,
} from '@mui/icons-material';
import useUserStore from '../store/userStore';

const features = [
  {
    icon: <SmartToy fontSize="large" />,
    title: 'AI‑Driven Scripts',
    desc: 'Convert any topic into a 2 min reel with your favorite characters.',
  },
  {
    icon: <VideoLibrary fontSize="large" />,
    title: 'TikTok‑Style Clips',
    desc: 'Engage through short, catchy videos optimized for Gen Z attention spans.',
  },
  {
    icon: <Person fontSize="large" />,
    title: 'Personalized Avatars',
    desc: 'Learn from “Peter”, “Stewie”, or create your own AI tutor persona.',
  },
  {
    icon: <EmojiEmotions fontSize="large" />,
    title: 'Fun & Gamified',
    desc: 'Earn streaks, badges, and share progress with your study buddies.',
  },
];

export default function LandingPage() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);

  const handlePricing = () => {
    navigate('/pricing');
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/app');      // your authenticated homepage route
    } else {
      navigate('/authentication');  // your login route
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />

      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            StudyBuddy
          </Typography>
          <Box>
            <Button sx={{ mr: 2 }} onClick={handlePricing}>
              Pricing
            </Button>
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                background: 'linear-gradient(90deg, #8E2DE2, #4A00E0)',
              }}
              onClick={handleGetStarted}
            >
              Lock In Now
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box
        sx={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#000',
          color: '#fff',
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                Learn Smarter, Not Harder
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
                2‑minute AI reels, your favorite characters, and a gamified study journey.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  textTransform: 'none',
                  fontSize: '1rem',
                  px: 4,
                  background: 'linear-gradient(90deg, #8E2DE2, #4A00E0)',
                }}
                onClick={handleGetStarted}
              >
                Try It Free
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 6 }}
        >
          Why StudyBuddy?
        </Typography>

        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {features.map((f, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex' }}>
              <Card
                elevation={2}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.05)',
                      mb: 1,
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' },
                    }}
                  >
                    {f.icon}
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call‑to‑Action */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container justifyContent="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h5" align="center" gutterBottom>
                Ready to supercharge your studies?
              </Typography>
              <Box textAlign="center">
                <Button
                  variant="contained"
                  size="large"
                  sx={{ textTransform: 'none', fontSize: '1rem', px: 4 }}
                  onClick={handleGetStarted}
                >
                  Create My Free Account
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ py: 4, textAlign: 'center', bgcolor: 'background.paper' }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {currentYear} StudyBuddy. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
