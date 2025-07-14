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
import api from "../api/axios";

const UploadSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const theme = useTheme();
  const [uploading,setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async() => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadResult(null);

    try{
      const formData = new FormData();
      formData.append("file",selectedFile);
      const response = await api.post(
        "/file/upload",
        formData,
        {
          withCredentials: true, // This is needed if your backend checks cookies
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadResult(response.data)


    }
    catch (error: any) {
      setUploadResult(
        error?.response?.data || "Upload failed. Check backend logs."
      );}
      finally {
        setUploading(false);
      }



  }

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
      {/* Choose File Button */}
      <Button
        variant="contained"
        component="label"
        startIcon={<UploadFileIcon />}
        sx={{
          fontFamily: '"Orbitron", sans-serif',
          bgcolor: "#8E24AA",
          "&:hover": { bgcolor: "#6A1B9A" },
        }}
      >
        Choose File
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {selectedFile && (
        <>
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
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </>
      )}

      {uploadResult && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: uploadResult.startsWith("File uploaded") ? "#43A047" : "#E53935",
          }}
        >
          {uploadResult}
        </Typography>
      )}
    </Stack>
    </Paper>
  );
};

export default UploadSection;
