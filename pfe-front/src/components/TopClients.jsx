import React from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const clients = [
  { name: 'OCP Group',       pct: 24, color: '#10b981' },
  { name: 'Maroc Telecom',   pct: 19, color: '#3b82f6' },
  { name: 'Attijariwafa',    pct: 14, color: '#8b5cf6' },
  { name: 'Centrale Danone', pct: 11, color: '#f59e0b' },
  { name: 'Autres',          pct: 32, color: '#cbd5e1' },
];

const TopClients = () => (
  <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>
        Top clients
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Par chiffre d'affaires ce mois
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
      {clients.map((c) => (
        <Box key={c.name}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b' }}>{c.name}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{c.pct}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={c.pct}
            sx={{
              height: 6, borderRadius: 5, bgcolor: '#f1f5f9',
              '& .MuiLinearProgress-bar': { bgcolor: c.color, borderRadius: 5 },
            }}
          />
        </Box>
      ))}
    </Box>

    {/* Alert for oldest unpaid invoice */}
    <Box sx={{
      mt: 3, p: 1.5, borderRadius: 2,
      bgcolor: '#fff7ed', border: '1px solid #fed7aa',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberRoundedIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
        <Box>
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400e' }}>
            Facture impayée — 38 jours
          </Typography>
          <Typography sx={{ fontSize: '0.68rem', color: '#b45309' }}>#F-2461 · Attijariwafa</Typography>
        </Box>
      </Box>
      <Chip
        label="Relancer"
        size="small"
        sx={{ fontSize: '0.65rem', bgcolor: '#f59e0b', color: 'white', fontWeight: 700, cursor: 'pointer',
          '&:hover': { bgcolor: '#d97706' } }}
      />
    </Box>
  </Box>
);

export default TopClients;
