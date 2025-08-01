// src/components/MeetOurCharacters.tsx
import { Box, Typography, Card, CardMedia, CardContent, Grid, Divider } from '@mui/material';

const characters = [
  {
    name: 'Peter Griffin',
    image: 'src/character-pics/Peter.PNG', // Adjust with your actual image path
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
      <Grid container spacing={4} justifyContent="center">
        {characters.map((char, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              <CardMedia
                component="img"
                image={char.image}
                alt={char.name}
                sx={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'contain' }}
              />
              <CardContent sx={{ textAlign: 'center' }}>
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
