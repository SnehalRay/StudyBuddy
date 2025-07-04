import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HeadsetIcon from '@mui/icons-material/Headset';

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

export default function FeatureSection() {
  return (
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
  );
}
