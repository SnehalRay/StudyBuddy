
// src/theme.ts
import type { createTheme, ThemeOptions } from "@mui/material/styles";

export const getDesignTokens = (mode: "light" | "dark"): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: "#f5f5f5",
          },
        }
      : {
          background: {
            default: "#101010",
          },
        }),
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});
