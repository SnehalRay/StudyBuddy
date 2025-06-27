import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import type { FolderType } from '../components/WorkspaceList';
import api from '../api/axios';

import FeatureSection from '../components/FeatureSection';
import WorkspaceList from '../components/WorkspaceList';
import CreateWorkspaceCard from '../components/CreateWorkspaceCard';
import CreateFolderDialog from '../components/CreateFolderDialog';

export default function Homepage() {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const resp = await api.get<FolderType[]>('/folder/listFolders');
        setFolders(resp.data);
      } catch (err) {
        console.error('Could not fetch folders', err);
      }
    }
    load();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post<string>('/folder/create', {
        name: newTitle,
        description: newDescription,
      });
      setIsDialogOpen(false);
      setNewTitle('');
      setNewDescription('');
      const listResp = await api.get<FolderType[]>('/folder/listFolders');
      setFolders(listResp.data);
    } catch (e: any) {
      console.error('Error creating folder', e);
      alert(e.message || 'Could not create folder');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <CreateFolderDialog
        open={isDialogOpen}
        title={newTitle}
        description={newDescription}
        onClose={() => setIsDialogOpen(false)}
        onChangeTitle={setNewTitle}
        onChangeDescription={setNewDescription}
        onCreate={handleCreate}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Choose a workspace to continue your study session
        </Typography>

        <FeatureSection />

        <Typography variant="h5" gutterBottom>
          Your Workspaces
        </Typography>
        <WorkspaceList folders={folders} />

        <Box mt={3}>
          <CreateWorkspaceCard onClick={() => setIsDialogOpen(true)} />
        </Box>
      </Container>
    </Box>
  );
}
