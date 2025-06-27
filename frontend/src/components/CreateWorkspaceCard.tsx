import React from 'react';
import { Grid, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  onClick: () => void;
}

export default function CreateWorkspaceCard({ onClick }: Props) {
  return (
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
        onClick={onClick}
      >
        <AddIcon fontSize="large" />
        <Button variant="text"> Create New Workspace</Button>
      </Paper>
    </Grid>
  );
}
