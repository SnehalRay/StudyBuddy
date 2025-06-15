import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Grid, 
  Fab,
  IconButton
} from '@mui/material';
import { 
  Code, 
  Storage, 
  Language, 
  BugReport, 
  Brush, 
  Javascript, 
  Add,
  Folder,
  Person,
  Login as LoginIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
}

interface UserFolder {
  id: string;
  name: string;
  itemCount: number;
  lastModified: string;
}

const techIcons = [
  { icon: Code, label: 'Spring Boot', color: '#6DB33F' },
  { icon: Storage, label: 'PostgreSQL', color: '#336791' },
  { icon: Language, label: 'React', color: '#61DAFB' },
  { icon: BugReport, label: 'Postman', color: '#FF6C37' },
  { icon: Brush, label: 'Figma', color: '#F24E1E' },
  { icon: Language, label: 'HTML', color: '#E34F26' },
  { icon: Language, label: 'CSS', color: '#1572B6' },
  { icon: Javascript, label: 'JavaScript', color: '#F7DF1E' },
  { icon: Code, label: 'Python', color: '#3776AB' }
];

const characters: Character[] = [
  {
    id: 'peter-stewie',
    name: 'Peter & Stewie',
    description: 'Dynamic duo for creative problem solving',
    avatar: '👨‍👶'
  },
  {
    id: 'rahul-modi',
    name: 'Rahul Modi',
    description: 'Expert in analytical thinking',
    avatar: '🧑‍💼'
  }
];

interface HomePageProps {
  onNavigateToAuth: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToAuth }) => {
  const [userFolders] = useState<UserFolder[]>([]);

  const TechSphere = () => {
    return (
      <Box className="relative h-96 flex items-center justify-center">
        <div className="tech-sphere relative w-64 h-64">
          {techIcons.map((tech, index) => {
            const angle = (index / techIcons.length) * 360;
            const radius = 120;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            const IconComponent = tech.icon;
            
            return (
              <motion.div
                key={tech.label}
                className="tech-icon absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  rotateY: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, delay: index * 0.2 }
                }}
              >
                <Box
                  className="flex items-center justify-center w-12 h-12 rounded-full"
                  sx={{
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    border: '2px solid rgba(96, 165, 250, 0.3)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <IconComponent 
                    sx={{ 
                      color: tech.color,
                      fontSize: 24,
                      filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))'
                    }} 
                  />
                </Box>
              </motion.div>
            );
          })}
        </div>
        
        {/* Central logo */}
        <motion.div
          className="absolute"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <Box
            className="w-20 h-20 rounded-full flex items-center justify-center"
            sx={{
              background: 'linear-gradient(45deg, #60A5FA, #A855F7)',
              boxShadow: '0 0 40px rgba(96, 165, 250, 0.5)',
            }}
          >
            <Typography variant="h4" className="font-bold text-white">
              SB
            </Typography>
          </Box>
        </motion.div>
      </Box>
    );
  };

  return (
    <Box className="min-h-screen" sx={{ backgroundColor: 'hsl(var(--background))' }}>
      {/* Header */}
      <Box className="flex justify-between items-center p-6">
        <Typography variant="h4" className="font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          StudyBuddy
        </Typography>
        <Button
          variant="outlined"
          startIcon={<LoginIcon />}
          onClick={onNavigateToAuth}
          sx={{
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            '&:hover': {
              borderColor: 'hsl(var(--primary))',
              backgroundColor: 'rgba(96, 165, 250, 0.1)'
            }
          }}
        >
          Login
        </Button>
      </Box>

      <Container maxWidth="xl" className="py-8">
        {/* Hero Section */}
        <Box className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h2" 
              className="font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              StudyBuddy
            </Typography>
            <Typography 
              variant="h5" 
              className="mb-8 text-muted-foreground max-w-2xl mx-auto"
            >
              Your all-in-one platform for collaborative learning, combining powerful tech and friendly characters.
            </Typography>
          </motion.div>
          
          <TechSphere />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Typography variant="body1" className="text-muted-foreground italic">
              Drag your mouse (or just watch) to see the magic!
            </Typography>
          </motion.div>
        </Box>

        {/* Character Cards Section */}
        <Box className="mb-16">
          <Typography variant="h4" className="font-bold mb-8 text-center">
            Choose Your Study Companion
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {characters.map((character, index) => (
              <Grid item xs={12} sm={6} md={4} key={character.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.6 }}
                >
                  <Card 
                    className="character-card cursor-pointer h-full"
                    sx={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      '&:hover': {
                        borderColor: 'hsl(var(--primary))',
                      }
                    }}
                  >
                    <CardContent className="text-center p-6">
                      <Box className="text-6xl mb-4">
                        {character.avatar}
                      </Box>
                      <Typography variant="h6" className="font-bold mb-2">
                        {character.name}
                      </Typography>
                      <Typography variant="body2" className="text-muted-foreground">
                        {character.description}
                      </Typography>
                    </CardContent>
                    <CardActions className="justify-center pb-4">
                      <Button 
                        variant="contained"
                        sx={{
                          backgroundColor: 'hsl(var(--primary))',
                          '&:hover': {
                            backgroundColor: 'hsl(var(--primary) / 0.8)',
                          }
                        }}
                      >
                        Start Learning
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Folders Section */}
        <Box>
          <Typography variant="h4" className="font-bold mb-8 text-center">
            Your Study Folders
          </Typography>
          
          {userFolders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <Card 
                className="cursor-pointer transition-all duration-300 hover:scale-105"
                sx={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '2px dashed hsl(var(--border))',
                  minWidth: 300,
                  minHeight: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    borderColor: 'hsl(var(--primary))',
                    backgroundColor: 'rgba(96, 165, 250, 0.05)',
                  }
                }}
              >
                <CardContent className="text-center">
                  <Add 
                    sx={{ 
                      fontSize: 48, 
                      color: 'hsl(var(--muted-foreground))',
                      mb: 2 
                    }} 
                  />
                  <Typography variant="h6" className="text-muted-foreground">
                    Create Your First Folder
                  </Typography>
                  <Typography variant="body2" className="text-muted-foreground mt-2">
                    Organize your study materials and notes
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Grid container spacing={3}>
              {userFolders.map((folder, index) => (
                <Grid item xs={12} sm={6} md={4} key={folder.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card 
                      className="cursor-pointer transition-all duration-300 hover:scale-105"
                      sx={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        '&:hover': {
                          borderColor: 'hsl(var(--primary))',
                        }
                      }}
                    >
                      <CardContent>
                        <Box className="flex items-center mb-3">
                          <Folder sx={{ color: 'hsl(var(--primary))', mr: 2 }} />
                          <Typography variant="h6">{folder.name}</Typography>
                        </Box>
                        <Typography variant="body2" className="text-muted-foreground">
                          {folder.itemCount} items • {folder.lastModified}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
              
              {/* Add new folder card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card 
                  className="cursor-pointer transition-all duration-300 hover:scale-105"
                  sx={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '2px dashed hsl(var(--border))',
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      borderColor: 'hsl(var(--primary))',
                    }
                  }}
                >
                  <CardContent className="text-center">
                    <Add sx={{ fontSize: 32, color: 'hsl(var(--muted-foreground))' }} />
                    <Typography variant="body2" className="text-muted-foreground mt-1">
                      New Folder
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
