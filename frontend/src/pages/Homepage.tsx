import React, { useState, useEffect } from 'react';
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

//Dialog box imports
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';


import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HeadsetIcon from '@mui/icons-material/Headset';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Grid from '@mui/material/Grid'; // Grid v2 import
import axios from 'axios';
import api from '../api/axios';



// defining the folder type for usage during fetch
export interface FolderType {
  id: number;
  title: string;
  description: string;
  docs: number; // number of files in the folder
  color?: string;
}

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
  const [folders, setFolders] = useState<FolderType[]>([]);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');



  // For opening the dialog box on click in the create folder button
  const handleOpen = () => {
    setIsDialogOpen(true);
  }

  const handleCreate = async () => {
    try{
      const resp = await api.post<string>('/folder/create', {
        name: newTitle,
        description: newDescription,
      });

      setIsDialogOpen(false);
      setNewTitle('');
      setNewDescription('');

      // reload the folder list so the new folder appears 
      const listResp = await api.get<FolderType[]>('/folder/listFolders');
      setFolders(listResp.data);
    } catch (e: any) {
      console.error('Error creating folder',e);
      alert(e.message || 'Could not create folder');
    }
  };
  


  useEffect (() => {
    async function load() {
      try{
        const resp = await api.get<FolderType[]>('/folder/listFolders');
      setFolders(resp.data);
      } catch (err) {
        console.error('Could not fetch folders', err);
      }
    }
    load();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{newTitle}</DialogTitle>
        <DialogContent>
          <TextField value={newTitle} label = "Title" onChange={e => setNewTitle(e.target.value)}/>
          <TextField value={newDescription} label = "Description" onChange={e => setNewDescription(e.target.value)} multiline />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!newTitle || !newDescription}>
            Create
          </Button>
      </DialogActions>
      </Dialog>
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
          {folders.map(ws => {
            // adjust header color for dark mode
            const rawColor = ws.color
              ? ws.color
              : (isDark ? '#555555' : '#E3F64D');

            const headerColor = isDark
              ? alpha(rawColor, 0.2)
              : rawColor;
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
                        {/* <Typography variant="caption">{ws.last}</Typography> */}
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
                
              }}
            >
              <AddIcon fontSize="large" />
              <Button variant="text" onClick={handleOpen}> Create New Workspace</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
