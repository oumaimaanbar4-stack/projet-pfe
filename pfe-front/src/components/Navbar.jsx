import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Box, IconButton, Menu, 
  MenuItem, Avatar, Divider, ListItemIcon, Button 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
// Icons
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
  import { useColorMode } from '../theme/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current path
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenProfileMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseProfileMenu = () => setAnchorEl(null);

  const theme = useTheme();
  const colorMode = useColorMode();

  const navPages = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clients', path: '/clients' },
    { label: 'Factures', path: '/factures' },
    { label: 'Rapports', path: '/rapports' },
  ];

  return (
    <AppBar position="sticky" color="inherit" elevation={1} sx={{ bgcolor: 'white' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* LEFT: Logo + Page Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
            onClick={() => navigate('/dashboard')}
          >
            <img src="/logo invoice.jpg" alt="Logo" style={{ height: '35px', marginRight: '10px' }} />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 900, letterSpacing: -1 }}>
              INVOICEFLOW
            </Typography>
          </Box>

          {/* Horizontal Menu for Pages */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navPages.map((page) => {
              const isActive = location.pathname === page.path; // Check if active
              return (
                <Button 
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  sx={{ 
                    borderRadius: 2, 
                    px: 2,
                    textTransform: 'none', // Keeps text as "Dashboard" not "DASHBOARD"
                    bgcolor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: isActive ? 800 : 600, 
                      color: isActive ? 'primary.main' : '#475569' 
                    }}
                  >
                    {page.label}
                  </Typography>
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* RIGHT: Profile Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleOpenProfileMenu} sx={{ p: 0.5, border: '2px solid #e2e8f0' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 35, height: 35 }}>A</Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseProfileMenu}
            PaperProps={{
              elevation: 4,
              sx: { width: 220, mt: 1.5, borderRadius: 3, p: 1 }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleCloseProfileMenu}>
              <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
              Mon Profil
            </MenuItem>
            <MenuItem onClick={handleCloseProfileMenu}>
              <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
              Paramètres
            </MenuItem>
            
            <MenuItem onClick={() => { 
                colorMode.toggleColorMode(); 
                handleCloseProfileMenu(); 
            }}>
              <ListItemIcon>
                <DarkModeIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">
                Mode {theme.palette.mode === 'light' ? 'Sombre' : 'Clair'}
              </Typography>
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem onClick={() => navigate('/login')} sx={{ color: 'error.main' }}>
              <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
              <b>Déconnexion</b>
            </MenuItem>
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;