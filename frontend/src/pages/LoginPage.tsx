import LoginCard from "../components/loginCard";
import SignupCard from "../components/signupCard";
import { useState } from "react";
import { Box, Typography } from "@mui/material";

const LoginPage = () => {

    const [showSignup, setShowSignup] = useState(true);



    return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 8,
        px: 20,
      }}
    >
      {/* LOGO */}
      <Typography
        variant="h2"
        fontWeight="bold"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "primary.main",
        }}
      >
        StudyBuddy
      </Typography>

      {/* MOTTO */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textAlign: "center", maxWidth: 300, color: "text.secondary", mb: -7 }}

      >
        "You study better with your buddies, us."
      </Typography>

      {/* CARD */}
      {showSignup ? (
        <LoginCard onToggle={() => setShowSignup(false)} />
      ) : (
        <SignupCard onToggle={() => setShowSignup(true)} />
      )}
    </Box>
  );;
};


export default LoginPage;