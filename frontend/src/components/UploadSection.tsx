import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Stack,
  Paper,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import "@fontsource/orbitron/700.css";
import api from "../api/axios";

const UploadSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const theme = useTheme();
  const [uploading,setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);

  // Fetch files list
  const fetchFiles = async () => {
    try {
      const response = await api.get("/file/listFiles");
      setFiles(response.data);
    } catch (err) {
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

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
    <>
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
     {/* FILES LIST AREA */}
     
      <Paper
        elevation={2}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 4,
          backgroundColor:
            theme.palette.mode === "dark" ? "#26232a" : "#f7e9fa",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            color: theme.palette.mode === "dark" ? "#FFEB3B" : "#7B1FA2",
            mb: 2,
          }}
        >
          Uploaded Files
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {files.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No files uploaded yet.
          </Typography>
        ) : (
          <List>
            {files.map((file) => (
              <ListItem key={file.id}>
                <ListItemIcon>
                  <DescriptionIcon color="secondary" />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      </>
  );
};

export default UploadSection;
