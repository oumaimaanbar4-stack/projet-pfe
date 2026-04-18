import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Box,Paper,TextField,Button,Typography,Container,AppBar,Toolbar,Link,IconButton,InputAdornment} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

const Login = () => {
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // State for form inputs (for state management next step)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
  // For now, we manually navigate. 
  // Later, this is where you'll call your Laravel API to check the email/password.
  navigate('/dashboard');
  }
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensures footer stays at the bottom
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      {/* --- PROFESSIONAL HEADER --- */}
      <AppBar position="static" color="inherit" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* LOGO FROM PUBLIC FOLDER */}
            <img 
              src="/logo invoice.jpg" 
              alt="InvoiceFlow Logo" 
              style={{ height: '45px', marginRight: '10px' }} 
            />
            <Typography variant="h5" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
              InvoiceFlow
            </Typography>
          </Box>
          <Box>
            <Button 
              variant="outlined" 
              color="primary" 
              sx={{ ml: 2, borderRadius: 20 }}
              onClick={() => navigate('/inscription')}
            >
              S'inscrire
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- ATTRACTIVE HERO SECTION + LOGIN CARD --- */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1, // Pushes footer down
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 4, md: 8 },
          py: { xs: 6, md: 10 },
        }}
      >
       
        {/* Left Side: Professional Marketing Content */}
        <Box sx={{ flex: 1.5, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography 
            variant="h2" 
            color="primary" 
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, 
              color: '#1a237e',
              whiteSpace: 'nowrap', // Forces the text to stay on one line
            }}
          >
            Manage your invoices <br/>
            <span style={{ color: '#1976d2' }}>easily & quickly</span>
          </Typography>

          <Typography 
            variant="h5" 
            color="textSecondary" 
            sx={{ mb: 4, lineHeight: 1.6, fontWeight: 400 }}
          >
            Track payments, organize finances, and export reports — <b>all in one place.</b>
          </Typography>

          <Typography variant="body1" color="textSecondary" sx={{ opacity: 0.8 }}>
            Connectez-vous pour commencer à gérer vos factures en toute sécurité.
          </Typography>
        </Box>

        {/* Right Side: Professional Login Card */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={4} // Deeper shadow for professional focus
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4, // More rounded corners
              width: '100%',
              maxWidth: 450,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Small centered logo inside card */}
            <img src="/logo invoice.jpg" alt="InvoiceFlow" style={{ height: '70px', marginBottom: '20px' }} />
            
            <Typography variant="h4" color="textPrimary" sx={{ fontWeight: 700, mb: 3 }}>
              Se Connecter
            </Typography>

            <form style={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Email *"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Mot de passe *"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Link href="#" variant="body2" color="primary">
                  Mot de passe oublié ?
                </Link>
              </Box>

              <Button 
                fullWidth 
                variant="contained" 
                size="large" 
                onClick={handleLogin} // This is the 'door handle'
                sx={{ py: 1.5, mt: 2, fontWeight: 'bold' }}
              >
                SE CONNECTER
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} <b>InvoiceFlow</b>. Tous droits réservés.
          </Typography>
          <Box sx={{ mt: 1, '& > *': { mx: 1 } }}>
            <Link href="#" variant="body2" color="textSecondary">Conditions d'utilisation</Link>
            |
            <Link href="#" variant="body2" color="textSecondary">Politique de confidentialité</Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;