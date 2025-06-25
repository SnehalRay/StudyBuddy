// src/components/ProfilePopup.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material';

type ProfilePopupProps = {
  open: boolean;
  onClose: () => void;
};

const ProfilePopup: React.FC<ProfilePopupProps> = ({ open, onClose }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [name, setName] = useState(user?.name || '');

  const handleSave = () => {
    const updatedUser = { ...user, name };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    onClose();
    window.location.reload(); // or update UI without reload if using global state
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/authentication';
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Display Name
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button onClick={handleLogout} color="error" variant="outlined">
          Log Out
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfilePopup;
