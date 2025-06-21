import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  Paper
} from "@mui/material";
import { useParams } from "react-router-dom";
import "@fontsource/orbitron/700.css";
import { motion } from "framer-motion";
import UploadSection from "../components/UploadSection";
import VoiceGenerationSection from "../components/VoiceGenerationSection";

const tabs = ["UPLOAD", "AI SUMMARY", "AI CHAT", "VOICE GENERATION"];

const WorkbookPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { folderName } = useParams(); // if using /workbook/:folderName route

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <UploadSection/>;
      case 1:
        return <Box>AI Summary Component/Section here</Box>;
      case 2:
        return <Box>AI Chat Component/Section here</Box>;
      case 3:
        return <VoiceGenerationSection/>;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography
        component={motion.h1}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        variant="h3"
        fontWeight="bold"
        sx={{
            fontFamily: '"Orbitron", sans-serif',
            mb: 4,
            textAlign: "center",
            letterSpacing: 2,
            textTransform: "uppercase",
            color: (theme) =>
            theme.palette.mode === "dark" ? "#D1A4FF" : "#6A1B9A",
            textShadow:
            "0 0 10px rgba(209, 164, 255, 0.7), 0 0 20px rgba(186, 104, 200, 0.5)",
        }}
        >
        {folderName || "Folder Name"}
        </Typography>


      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        {tabs.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {renderTabContent()}
      </Paper>
    </Container>
  );
};

export default WorkbookPage;
