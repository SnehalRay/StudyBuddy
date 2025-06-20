import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HeadsetIcon from '@mui/icons-material/Headset';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Grid from '@mui/material/Grid'; // Grid v2 import

// dummy workspace data
const workspaces = [
  {
    id: 1,
    title: 'Biology Notes',
    description: 'Cell biology and genetics study materials',
    docs: 5,
    last: '2 hours ago',
    color: '#E6FFED',
  },
  {
    id: 2,
    title: 'Physics Research',
    description: 'Quantum mechanics and thermodynamics',
    docs: 8,
    last: '1 day ago',
    color: '#E3F2FD',
  },
  {
    id: 3,
    title: 'History Essays',
    description: 'World War II documentation and analysis',
    docs: 3,
    last: '3 days ago',
    color: '#F3E5F5',
  },
];

// styled paper for feature cards
const FeatureCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

// styled paper for workspaces
const WSCard = styled(Paper)<{ headercolor: string }>(({ theme, headercolor }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: theme.shadows[1], // subtle shadow for static cards
  '& .header': {
    backgroundColor: headercolor,
    padding: theme.spacing(2), // increased padding
  },
  '& .body': {
    flex: 1,
    padding: theme.spacing(3), // increased padding
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

export default function Homepage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome text */}
        <Typography variant="h4" gutterBottom>
          Welcome back!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Choose a workspace to continue your study session
        </Typography>

        {/* Feature cards */}
        <Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FeatureCard>
              <DescriptionIcon fontSize="large" color="primary" />
              <Box>
                <Typography variant="h6">Document Analysis</Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload PDFs, notes, and documents for AI-powered summaries and insights
                </Typography>
              </Box>
            </FeatureCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FeatureCard>
              <ChatBubbleIcon fontSize="large" color="primary" />
              <Box>
                <Typography variant="h6">Smart Chat</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ask questions about your materials and get detailed explanations
                </Typography>
              </Box>
            </FeatureCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FeatureCard>
              <HeadsetIcon fontSize="large" color="primary" />
              <Box>
                <Typography variant="h6">Audio Conversations</Typography>
                <Typography variant="body2" color="text.secondary">
                  Generate podcast-style discussions about your study materials
                </Typography>
              </Box>
            </FeatureCard>
          </Grid>
        </Grid>

        {/* Your Workspaces */}
        <Typography variant="h5" gutterBottom>
          Your Workspaces
        </Typography>
        <Grid container spacing={3}>
          {workspaces.map(ws => {
            // adjust header color for dark mode
            const headerColor = isDark
              ? alpha(ws.color, 0.2)
              : ws.color;
            return (
              <Grid key={ws.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <WSCard headercolor={headerColor}>
                  <Box className="header">
                    <Typography variant="subtitle1" fontWeight={600}>
                      {ws.title}
                    </Typography>
                  </Box>
                  <Box className="body">
                    <Typography variant="body2" color="text.secondary">
                      {ws.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <FolderOpenIcon fontSize="small" color="action" />
                        <Typography variant="caption">{ws.docs} documents</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="caption">{ws.last}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </WSCard>
              </Grid>
            );
          })}

          {/* Create New Workspace card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              variant="outlined"
              sx={{
                height: '100%',
                borderStyle: 'dashed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'text.secondary',
                cursor: 'pointer',
                '&:hover': { bgcolor: theme.palette.action.hover },
              }}
            >
              <AddIcon fontSize="large" />
              <Typography variant="subtitle1" mt={1}>
                Create New Workspace
              </Typography>
              <Typography variant="caption">
                Start organizing your study materials
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
