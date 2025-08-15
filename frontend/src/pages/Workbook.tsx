import React, { useState, useRef, useEffect } from 'react';
import VideoSummary from '../components/VideoSummary';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  TextField,
  Stack,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  useTheme,
  Chip
} from '@mui/material';
import {
  AttachFile,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { api } from '../api/axios';
import CharacterPickerDialog from '../components/CharacterPickerDialog';
import { characters, type Character } from '../components/characters';

export default function DiscoverPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Character picker state ---
  const [isCharDialogOpen, setIsCharDialogOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  // --- Upload logic states ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [files, setFiles] = useState<{ id: string; name: string }[]>([]);

  // Fetch the list of uploaded files
  const fetchFiles = async () => {
    try {
      const resp = await api.get<{ id: string; name: string }[]>('/file/listFiles');
      setFiles(resp.data);
    } catch {
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // When user clicks the paper-clip
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // When a file is chosen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  // POST file to backend
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const resp = await api.post<string>('/file/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setUploadResult(resp.data);
      setSelectedFile(null);
      await fetchFiles(); // refresh list
    } catch (err: any) {
      setUploadResult(err?.response?.data || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: isDark ? 'background.default' : 'background.paper',
        color: 'text.primary',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        {/* Heading */}
        <Typography variant="h4" fontWeight={500} gutterBottom>
          What are you learning today?
        </Typography>

        {/* Character selector */}
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
          <Button variant="outlined" size="small" onClick={() => setIsCharDialogOpen(true)}>
            Select character
          </Button>
          <Button variant="outlined" size="small">
            Select background
          </Button>

          {/* Show chosen character summary (if any) */}
        </Stack>

        

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Prompt + upload adornment */}
        <TextField
          fullWidth
          size="small"
          multiline
          rows={2}
          placeholder="What is the powerhouse of the cell?"
          variant="outlined"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  size="small"
                  onClick={handleUploadClick}
                  aria-label="upload file"
                >
                  <AttachFile fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDark ? 'grey.900' : 'common.white',
              borderRadius: '16px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '16px',
              },
            },
          }}
        />
        
        <VideoSummary prompt={prompt} />

        {/* Show chosen file & upload button */}
        {selectedFile && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" noWrap>
              📄 {selectedFile.name}
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{ mt: 1 }}
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
          </Box>
        )}

        {/* Upload result message */}
        {uploadResult && (
          <Typography
            variant="body2"
            sx={{
              color: uploadResult.startsWith('File uploaded') ? 'success.main' : 'error.main',
              mb: 2,
            }}
          >
            {uploadResult}
          </Typography>
        )}

        {/* List of uploaded files */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: isDark ? 'grey.900' : 'grey.50',
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Your Files
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {files.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No files uploaded yet.
            </Typography>
          ) : (
            <List dense disablePadding>
              {files.map((f) => (
                <ListItem key={f.id}>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary={f.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
      {/* Character dialog */}
      <CharacterPickerDialog
        open={isCharDialogOpen}
        onClose={() => setIsCharDialogOpen(false)}
        onSelect={(c) => setSelectedCharacter(c)}
        characters={characters}
      />
    </Box>
  );
}