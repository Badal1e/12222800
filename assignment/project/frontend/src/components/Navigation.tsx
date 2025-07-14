import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Link as LinkIcon, BarChart3 } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <LinkIcon size={24} style={{ marginRight: 8 }} />
          <Typography variant="h6" component="div">
            URL Shortener
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            variant={location.pathname === '/' ? 'outlined' : 'text'}
            startIcon={<LinkIcon size={16} />}
          >
            Shorten
          </Button>
          <Button
            component={Link}
            to="/statistics"
            color="inherit"
            variant={location.pathname === '/statistics' ? 'outlined' : 'text'}
            startIcon={<BarChart3 size={16} />}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;