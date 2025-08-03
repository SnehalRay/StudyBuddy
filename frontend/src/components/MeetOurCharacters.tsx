// src/components/MeetOurCharacters.tsx
import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Grid, Divider, Button } from '@mui/material';

const characters = [
  {
    name: 'Peter Griffin',
    image: 'src/character-pics/Peter.PNG',
    description: 'Peter Griffin from family guy',
    audioSrc: '/voices/peter.mp3',
  },
  {
    name: 'CaseOh',
    image: 'src/character-pics/CaseoH.PNG',
    description: 'The eater of worlds',
    audioSrc: '/voices/samantha.mp3',
  },
  {
    name: 'Stewie',
    image: 'src/character-pics/stewie.PNG',
    description: "Peter's friend",
    audioSrc: '/voices/robomax.mp3',
  },
  {
    name: 'IShowSpeed',
    image: 'src/character-pics/speed.PNG',
    description: 'The barking streamer with Aura',
    audioSrc: '/voices/luna.mp3',
  },
];

export default function MeetOurCharacters() {
  return (
    <Box sx={{ p: 5, bgcolor: 'background.default' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Meet Our Characters
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="stretch"            // stretch all cells to equal height
      >
        {characters.map((char, idx) => (
          <Grid
            key={idx}
            size={{ xs: 12, sm: 6, md: 3 }}  // shorthand for item + breakpoints
            sx={{ display: 'flex' }}         // make the cell flex
          >
            <Card
              elevation={2}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,                       // fill the cell height
                alignItems: 'center',
                p: 2,
              }}
            >
              <CardMedia
                component="img"
                image={char.image}
                alt={char.name}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  objectFit: 'contain',
                }}
              />

              <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                <Typography variant="h6">{char.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {char.description}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', mb: 0.5 }}>
                  Voice Snippet
                </Typography>
                <audio controls style={{ width: '100%' }}>
                  <source src={char.audioSrc} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </CardContent>

              {/* Example of pushing a button to the bottom */}
              <Box sx={{ mt: 'auto', pt: 1 }}>
                <Button size="small">Learn More</Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 6 }} />

      <Typography variant="body2" color="text.secondary" align="center">
        Community voice clones and custom characters — <b>Coming soon.</b> Stay tuned for voice generation tools!
      </Typography>
    </Box>
  );
}
