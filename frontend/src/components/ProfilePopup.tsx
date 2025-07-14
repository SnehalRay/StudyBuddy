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
import { toast } from "react-toastify";
import api from '../api/axios';


type ProfilePopupProps = {
  open: boolean;
  onClose: () => void;
};

const ProfilePopup: React.FC<ProfilePopupProps> = ({ open, onClose }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [name, setName] = useState(user?.name || '');

  const handleSave = async () => {
  try {
    // Call backend to update name
    const response = await api.put("/edit-profile", { name });

    // Update localStorage with new name
    const updatedUser = { ...user, name: response.data.name };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Notify success
    toast.success("✅ Profile updated successfully", {
      position: "top-center",
      autoClose: 3000,
    });

    // Close the dialog and refresh UI
    onClose();
    window.location.reload(); // or use context/global state instead of reload

  } catch (error: any) {
    const apiError = error.response?.data;
    const fallback = "Failed to update profile.";
    const message = typeof apiError === 'string' ? apiError : fallback;

    console.error("Edit profile failed:", message);

    toast.error(`❌ ${message}`, {
      position: "top-center",
      autoClose: 4000,
    });
  }
};


  const handleLogout = async () => {
  try {
    // Call the backend logout API to clear the cookie
    await api.post("/logout");

    // Remove user info from localStorage
    localStorage.removeItem('user');

    // Redirect to login page
    window.location.href = '/authentication';

    // Optional: show toast on successful logout
    toast.success("✅ Logged out successfully.", {
      position: "top-center",
      autoClose: 3000,
    });

  } catch (error: any) {
    const apiError = error.response?.data?.error;
    const fallback = "Logout failed. Please try again.";
    const message = typeof apiError === 'string' ? apiError : fallback;

    console.error("Logout failed:", message);

    toast.error(`❌ ${message}`, {
      position: "top-center",
      autoClose: 4000,
    });
  }
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
