// src/components/VideoSummary.tsx
import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography, Stack, Chip } from '@mui/material';
import { pyapi } from '../api/axios';
import useFolderId from '../hook/useFolderId';

interface VideoSummaryProps {
  prompt: string;
}

export default function VideoSummary({ prompt }: VideoSummaryProps) {
  const { folderId, loading: folderLoading, error: folderError, refresh } = useFolderId();

  const [loading, setLoading]     = useState(false);
  const [videoUrl, setVideoUrl]   = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      if (!folderId) {
        throw new Error(folderError || 'Folder ID not available. Open a folder first.');
      }

      // Python expects: { folderID: string, prompt: string }
      const resp = await pyapi.post(
        '/summarize-into-video',
        { folderID: folderId, prompt },
        { responseType: 'blob', withCredentials: true }
      );

      const url = URL.createObjectURL(resp.data);
      setVideoUrl(url);
    } catch (e: any) {
      console.error('Video generation error:', e);
      const msg =
        e?.response?.data?.detail ||
        (typeof e?.response?.data === 'string' ? e.response.data : null) ||
        e?.message ||
        'Failed to generate video';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
        <Typography variant="body2">Folder ID:</Typography>
        {folderLoading ? (
          <Chip label="Resolving..." />
        ) : folderId ? (
          <Chip color="success" variant="outlined" label={folderId} />
        ) : (
          <Chip color="warning" variant="outlined" label="Not resolved" />
        )}
        <Button size="small" onClick={refresh} disabled={folderLoading}>
          {folderLoading ? 'Refreshing…' : 'Refresh'}
        </Button>
      </Stack>

      {folderError && (
        <Typography color="error" sx={{ mt: 1 }}>
          {folderError}
        </Typography>
      )}

      <Button
        sx={{ mt: 2 }}
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
