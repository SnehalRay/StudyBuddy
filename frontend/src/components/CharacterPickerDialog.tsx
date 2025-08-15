import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton, Grid, Card, CardMedia,
  CardContent, Typography, Box, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Character } from './characters';

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (c: Character) => void;
  characters: Character[];
};

export default function CharacterPickerDialog({ open, onClose, onSelect, characters }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        Select a Character
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {characters.map((char) => (
            <Grid key={char.name} item xs={12} sm={6} md={3}>
              <Card
                elevation={2}
                sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', p: 2 }}
              >
                <CardMedia
                  component="img"
                  image={char.image}
                  alt={char.name}
                  sx={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'contain' }}
                />
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Typography variant="h6">{char.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {char.description}
                  </Typography>
                </CardContent>
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      onSelect(char);
                      onClose();
                    }}
                  >
                    Select
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
