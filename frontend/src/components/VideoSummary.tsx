// src/components/VideoSummary.tsx
import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { pyapi } from '../api/axios';

interface VideoSummaryProps {
  prompt: string;
}

export default function VideoSummary({ prompt }: VideoSummaryProps) {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const resp = await pyapi.post(
        '/summarize-into-video/',
        { prompt },
        { responseType: 'blob' }
      );
      const url = URL.createObjectURL(resp.data);
      setVideoUrl(url);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to generate video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Button
        variant="contained"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
      >
        {loading ? <CircularProgress size={20} /> : 'Generate Video Summary'}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {videoUrl && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Your Video Summary
          </Typography>
          <video
            src={videoUrl}
            controls
            style={{ width: '100%', maxHeight: 400, borderRadius: 8 }}
          />
        </Box>
      )}
    </Box>
  );
}
