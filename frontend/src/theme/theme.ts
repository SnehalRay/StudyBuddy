
// src/theme.ts
import type { createTheme, ThemeOptions } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: { default: "#f5f5f5" },
          primary: {
            main: "#6a5acd", // fallback purple
          },
        }
      : {
          background: { default: "#101010" },
          primary: {
            main: "#8a2be2", // fallback purple
          },
        }),
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: mode === "light"
            ? "linear-gradient(90deg, #6a5acd 0%, #00bfff 100%)"
            : "linear-gradient(90deg, #8a2be2 0%, #1e90ff 100%)",
          color: "#fff",
          "&:hover": {
            background: mode === "light"
              ? "linear-gradient(90deg, #5b4dbf 0%, #00a5e0 100%)"
              : "linear-gradient(90deg, #7a1fcf 0%, #1a80e0 100%)",
          },
        },
      },
    },
  },
});
