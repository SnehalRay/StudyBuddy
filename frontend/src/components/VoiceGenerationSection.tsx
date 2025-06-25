import React, { useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  Select,
  Paper
} from "@mui/material";
import "@fontsource/orbitron/700.css";

const narrators = ["Peter and Stewie", "Ronaldo and Messi", "Rahul and Modi", "Loosid and Turbo 🐐"];

const VoiceGenerationSection = () => {
  const [selectedNarrator, setSelectedNarrator] = useState(narrators[0]);

  // Replace with your actual audio file URL logic
  const voiceFileURL =
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  const handleChange = (event: any) => {
    setSelectedNarrator(event.target.value);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 4,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1C1C1E" : "#F9F6FB",
      }}
    >
      {/* Title and Dropdown */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: (theme) =>
              theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
          }}
        >
          Narrator: {selectedNarrator}
        </Typography>

        <FormControl
          sx={{
            minWidth: 220,
            backgroundColor: "#fff",
            borderRadius: 2,
          }}
          size="small"
        >
          <Select
            value={selectedNarrator}
            onChange={handleChange}
            displayEmpty
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: "bold",
              color: "#6A1B9A",
              borderRadius: 2,
              "& .MuiSelect-icon": {
                color: "#6A1B9A",
              },
            }}
          >
            {narrators.map((narrator, idx) => (
              <MenuItem key={idx} value={narrator}>
                {narrator}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Conversation Box */}
      <Box
        mt={4}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#2A2A2E" : "#EFE7F3",
          border: "1px solid #AB47BC",
          minHeight: "200px",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontFamily: "inherit",
            color: (theme) =>
              theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
          }}
        >
          {`[Conversation between ${selectedNarrator} will be shown here...]`}
        </Typography>
      </Box>

      {/* Audio Player */}
      {voiceFileURL && (
        <Box mt={4} textAlign="center">
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "inherit",
              color: (theme) =>
                theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
              mb: 1,
            }}
          >
            Listen to the generated voice
          </Typography>
          <audio controls style={{ width: "100%", maxWidth: 600 }}>
            <source src={voiceFileURL} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}
    </Paper>
  );
};

export default VoiceGenerationSection;
