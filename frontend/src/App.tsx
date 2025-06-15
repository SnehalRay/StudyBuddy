
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create Material-UI dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60A5FA', // blue-400
    },
    secondary: {
      main: '#A855F7', // purple-500
    },
    background: {
      default: 'hsl(220, 25%, 8%)',
      paper: 'hsl(220, 20%, 12%)',
    },
    text: {
      primary: 'hsl(210, 40%, 98%)',
      secondary: 'hsl(215, 16.3%, 56.9%)',
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'hsl(220, 25%, 8%)',
        },
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
