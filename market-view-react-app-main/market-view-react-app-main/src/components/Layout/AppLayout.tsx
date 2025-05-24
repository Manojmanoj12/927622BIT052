
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
} from '@mui/material';
import { TrendingUp, ScatterPlot } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

interface AppLayoutProps {
  children: React.ReactNode;
  currentTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentTab, onTabChange }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <TrendingUp sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Stock Market Analytics
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
          <Paper elevation={1} sx={{ mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={onTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab
                icon={<TrendingUp />}
                label="Stock Analysis"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab
                icon={<ScatterPlot />}
                label="Correlation Heatmap"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            </Tabs>
          </Paper>
          
          <Box sx={{ mt: 2 }}>
            {children}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;
