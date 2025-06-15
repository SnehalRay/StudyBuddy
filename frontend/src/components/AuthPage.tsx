
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number; }) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 1.5, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

const AuthPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  // "Fake" login/register for UI purposes
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      localStorage.setItem('isAuthorized', 'true');
      setLoading(false);
      navigate('/home');
    }, 500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (registerForm.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }
    setTimeout(() => {
      localStorage.setItem('isAuthorized', 'true');
      setLoading(false);
      navigate('/home');
    }, 500);
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center p-4"
      sx={{
        background:
          'radial-gradient(circle at 50% 20%, rgba(96,165,250,0.25) 0%, transparent 70%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.18) 0%, transparent 70%), hsl(220,25%,8%)',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={20}
            sx={{
              backgroundColor: 'rgba(20,22,34,0.96)',
              border: '1.5px solid hsl(240,11%,20%)',
              borderRadius: 4,
              overflow: 'hidden',
              backdropFilter: 'blur(12px)'
            }}
          >
            {/* Branding and header */}
            <Box className="flex flex-col items-center p-7 pb-4">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #60A5FA 0%, #A855F7 60%, #F472B6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: `'Inter', system-ui, sans-serif`,
                  mb: 1
                }}
              >
                StudyBuddy
              </Typography>
              <Typography
                variant="subtitle1"
                className="text-muted-foreground"
                sx={{
                  color: 'hsl(210,40%,88%)',
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                Sign in to start collaborating!
              </Typography>
            </Box>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 700,
                  color: 'hsl(215,16%,58%)',
                  '&.Mui-selected': {
                    color: '#A855F7',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#A855F7',
                }
              }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            {/* Animated alerts */}
            <AnimatePresence>
              {(error || success) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6"
                >
                  <Alert
                    severity={error ? 'error' : 'success'}
                    sx={{
                      mb: 2,
                      mt: 2,
                      borderRadius: 2,
                      fontWeight: 500,
                      color: error ? '#FF5252' : '#009175'
                    }}
                  >
                    {error || success}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <TabPanel value={tabValue} index={0}>
              <form onSubmit={handleLogin} className="space-y-4">
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  autoComplete="username"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#60A5FA' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'hsl(220,20%,18%)' },
                      '&:hover fieldset': { borderColor: '#A855F7' },
                      '&.Mui-focused fieldset': { borderColor: '#A855F7' },
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      color: '#f3f4f7'
                    },
                    '& .MuiInputLabel-root': { color: 'hsl(215,16%,58%)' },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#A855F7' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#60A5FA' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'hsl(220,20%,18%)' },
                      '&:hover fieldset': { borderColor: '#A855F7' },
                      '&.Mui-focused fieldset': { borderColor: '#A855F7' },
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      color: '#f3f4f7'
                    },
                    '& .MuiInputLabel-root': { color: 'hsl(215,16%,58%)' },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    backgroundImage: 'linear-gradient(90deg, #60A5FA 0%, #A855F7 80%)',
                    fontWeight: 700,
                    color: '#fff',
                    boxShadow: '0 2px 14px 0 rgba(96, 165, 250, 0.14), 0 1.5px 5px 0 rgba(168, 85, 247, 0.12)',
                    borderRadius: 2,
                    py: 1.6,
                    mt: 1.8,
                    fontSize: 18,
                    '&:hover': { backgroundImage: 'linear-gradient(90deg, #A855F7 0%, #60A5FA 100%)', opacity: 0.95 }
                  }}
                >
                  {loading ? <CircularProgress size={26} color="inherit" /> : 'Login'}
                </Button>
              </form>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <form onSubmit={handleRegister} className="space-y-4">
                <Box className="grid grid-cols-2 gap-3">
                  <TextField
                    fullWidth
                    label="First Name"
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#60A5FA' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': { borderColor: 'hsl(220,20%,18%)' },
                        '&:hover fieldset': { borderColor: '#A855F7' },
                        '&.Mui-focused fieldset': { borderColor: '#A855F7' },
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        color: '#f3f4f7'
                      },
                      '& .MuiInputLabel-root': { color: 'hsl(215,16%,58%)' },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Last Name"
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': { borderColor: 'hsl(220,20%,18%)' },
                        '&:hover fieldset': { borderColor: '#A855F7' },
                        '&.Mui-focused fieldset': { borderColor: '#A855F7' },
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        color: '#f3f4f7'
                      },
                      '& .MuiInputLabel-root': { color: 'hsl(215,16%,58%)' },
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#60A5FA' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'hsl(220,20%,18%)' },
                      '&:hover fieldset': { borderColor: '#A855F7' },
                      '&.Mui-focused fieldset': { borderColor: '#A855F7' },
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      color: '#f3f4f7'
                    },
                    '& .MuiInputLabel-root': { color: 'hsl(215,16%,58%)' },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#A855F7' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#60A5FA' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'hsl(220,20%,18%)' },
                      '&:hover fieldset': { borderColor: '#A855F7' },
                      '&.Mui-focused fieldset': { borderColor: '#A855F7' },
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      color: '#f3f4f7'
                    },
                    '& .MuiInputLabel-root': { color: 'hsl(215,16%,58%)' },
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#A855F7' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#60A5FA' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'hsl(220,20%,18%)' },
                      '&:hover fieldset': { borderColor: '#A855F7' },
                      '&.Mui-focused fieldset': { borderColor: '#A855F7' },
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      color: '#f3f4f7'
                    },
                    '& .MuiInputLabel-root': { color: 'hsl(215,16%,58%)' },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    backgroundImage: 'linear-gradient(90deg, #60A5FA 0%, #A855F7 80%)',
                    fontWeight: 700,
                    color: '#fff',
                    boxShadow: '0 2px 14px 0 rgba(96, 165, 250, 0.14), 0 1.5px 5px 0 rgba(168, 85, 247, 0.12)',
                    borderRadius: 2,
                    py: 1.6,
                    mt: 2,
                    fontSize: 18,
                    '&:hover': { backgroundImage: 'linear-gradient(90deg, #A855F7 0%, #60A5FA 100%)', opacity: 0.95 }
                  }}
                >
                  {loading ? <CircularProgress size={26} color="inherit" /> : 'Create Account'}
                </Button>
              </form>
            </TabPanel>
            <Box sx={{ height: 26 }} />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AuthPage;

