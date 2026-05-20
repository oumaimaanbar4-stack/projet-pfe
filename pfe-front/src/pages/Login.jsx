import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Paper, TextField, Button, Typography, Container, 
  AppBar, Toolbar, Link, IconButton, InputAdornment, Alert 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

// CRITICAL: Import your configured axios instance
import api from '../services/api'; 

const Login = () => {
  const navigate = useNavigate();

  // State Management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Password Visibility Toggles
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // The Fixed API Login Sequence
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents page reload
    setErrorMsg('');
    setLoading(true);

    // Basic Validation
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      setLoading(false);
      return;
    }

    try {
      // 1. Send authentication request to Laravel backend
      const response = await api.post('/login', {
        email: email,
        password: password,
      });

      // 2. Validate response payload
      if (response.data && response.data.access_token) {
        // 3. Store token cleanly (matches your interceptor key 'token')
        localStorage.setItem('token', response.data.access_token);
        
        // 4. Safely reroute inside the authorized ecosystem
        navigate('/dashboard');
      } else {
        setErrorMsg('Structure de réponse invalide reçue du serveur.');
      }
    } catch (error) {
      console.error("Login Error:", error);
      
      // Handle server validation and mismatch responses (like 401 Identifiants invalides)
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || 'Identifiants invalides.');
      } else {
        setErrorMsg('Impossible de contacter le serveur backend (localhost:8000).');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      {/* --- PROFESSIONAL HEADER --- */}
      <AppBar position="static" color="inherit" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

      {/* --- HERO SECTION + LOGIN CARD --- */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 4, md: 8 },
          py: { xs: 6, md: 10 },
        }}
      >
        {/* Left Side: Marketing Content */}
        <Box sx={{ flex: 1.5, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              mb: 2, 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }, 
              color: '#1a237e',
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
            elevation={4}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              width: '100%',
              maxWidth: 450,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src="/logo invoice.jpg" alt="InvoiceFlow" style={{ height: '70px', marginBottom: '20px' }} />
            
            <Typography variant="h4" color="textPrimary" sx={{ fontWeight: 700, mb: 3 }}>
              Se Connecter
            </Typography>

            {/* Error Message Box */}
            {errorMsg && (
              <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Email *"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
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
                disabled={loading}
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
                type="submit"
                variant="contained" 
                size="large" 
                disabled={loading}
                sx={{ py: 1.5, mt: 2, fontWeight: 'bold' }}
              >
                {loading ? 'CONNEXION EN COURS...' : 'SE CONNECTER'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* --- FOOTER --- */}
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