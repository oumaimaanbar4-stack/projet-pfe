import React, { useState } from 'react';
import {
  Box, Paper, TextField, Button, Typography, Container, 
  Stepper, Step, StepLabel, InputAdornment, MenuItem, AppBar, Toolbar, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import PublicIcon from '@mui/icons-material/Public';

const steps = ['Compte Personnel', 'Détails Professionnels'];

const Inscription = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      {/* Consistent Navbar */}
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e2e8f0' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src="/logo invoice.jpg" alt="Logo" style={{ height: '35px', marginRight: '10px' }} />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 800, letterSpacing: 1 }}>
              INVOICEFLOW
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e2e8f0' }}>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', mb: 1 }}>
              Créer un compte
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Accédez à toutes les fonctionnalités d'InvoiceFlow en 2 étapes.
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} centered sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form>
            {activeStep === 0 ? (
              /* --- STEP 1: IDENTITY (Utilisateur attributes) --- */
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField fullWidth label="Prénom" variant="outlined" />
                  <TextField fullWidth label="Nom" variant="outlined" />
                </Box>
                <TextField 
                  fullWidth label="Email" 
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" /></InputAdornment> }}
                />
                <TextField 
                  fullWidth label="Mot de passe" type="password"
                  InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment> }}
                />
              </Box>
            ) : (
              /* --- STEP 2: PROFESSIONAL (Enterprise context) --- */
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField 
                  fullWidth label="Nom de la Société" 
                  placeholder="Ex: SARL MaEntreprise"
                  InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon fontSize="small" /></InputAdornment> }}
                />
                <TextField
                  select fullWidth label="Votre Rôle" defaultValue="Comptable"
                  InputProps={{ startAdornment: <InputAdornment position="start"><WorkIcon fontSize="small" /></InputAdornment> }}
                >
                  <MenuItem value="Administrateur">Administrateur</MenuItem>
                  <MenuItem value="Comptable">Comptable</MenuItem>
                  <MenuItem value="Gérant">Gérant</MenuItem>
                </TextField>
                <TextField
                  select fullWidth label="Pays de l'entreprise" defaultValue="Maroc"
                  InputProps={{ startAdornment: <InputAdornment position="start"><PublicIcon fontSize="small" /></InputAdornment> }}
                >
                  <MenuItem value="Maroc">Maroc</MenuItem>
                  <MenuItem value="France">France</MenuItem>
                  <MenuItem value="Sénégal">Sénégal</MenuItem>
                </TextField>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth variant="contained" size="large"
                onClick={activeStep === steps.length - 1 ? undefined : handleNext}
                sx={{ py: 1.5, fontWeight: 'bold', borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
              >
                {activeStep === steps.length - 1 ? "S'inscrire maintenant" : "Suivant"}
              </Button>
              
              {activeStep !== 0 && (
                <Button fullWidth color="inherit" onClick={handleBack} sx={{ textTransform: 'none' }}>
                  Retourner à l'étape précédente
                </Button>
              )}
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Déjà un compte ?{' '}
              <Link onClick={() => navigate('/login')} sx={{ fontWeight: 'bold', cursor: 'pointer', color: 'primary.main', textDecoration: 'none' }}>
                Se connecter
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Box sx={{ py: 3, textAlign: 'center', borderTop: '1px solid #e2e8f0', bgcolor: 'white' }}>
        <Typography variant="caption" color="textSecondary">
          © 2026 InvoiceFlow. En vous inscrivant, vous acceptez nos Conditions d'utilisation.
        </Typography>
      </Box>
    </Box>
  );
};

export default Inscription;