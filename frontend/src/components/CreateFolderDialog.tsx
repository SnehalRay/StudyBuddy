import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface Props {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onChangeTitle: (s: string) => void;
  onChangeDescription: (s: string) => void;
  onCreate: () => void;
}

export default function CreateFolderDialog({
  open,
  title,
  description,
  onClose,
  onChangeTitle,
  onChangeDescription,
  onCreate,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          value={title}
          label="Title"
          fullWidth
          onChange={e => onChangeTitle(e.target.value)}
        />
        <TextField
          value={description}
          label="Description"
          fullWidth
          multiline
          onChange={e => onChangeDescription(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onCreate} disabled={!title || !description}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
