import React, { useState } from "react";
import {
  Typography,
  Button,
  Stack,
  Paper,
  useTheme
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import "@fontsource/orbitron/700.css";

const UploadSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const theme = useTheme();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 4,
        textAlign: "center",
        border: "2px dashed #AB47BC",
        backgroundColor:
          theme.palette.mode === "dark" ? "#1C1C1E" : "#F9F6FB",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontFamily: "inherit", // use theme default font
          color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
          mb: 3,
        }}
      >
        Upload your file
      </Typography>

      <Stack spacing={2} alignItems="center">
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            bgcolor: "#8E24AA",
            "&:hover": {
              bgcolor: "#6A1B9A",
            },
          }}
        >
          Choose File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {selectedFile && (
          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
              fontFamily: "inherit",
              color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
              wordBreak: "break-word",
            }}
          >
            Selected: {selectedFile.name}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default UploadSection;
