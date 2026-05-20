import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import api from '../services/api';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

const TopClients = () => {
  const [clients, setClients]       = useState([]);
  const [overdueInvoice, setOverdueInvoice] = useState(null);

  useEffect(() => {
    api.get('/dashboard/top-clients').then(res => setClients(res.data));

    // Get oldest overdue invoice for the alert
    api.get('/factures').then(res => {
      const overdue = res.data
        .filter(f => f.statut === 'en_retard')
        .sort((a, b) => new Date(a.date_echeance) - new Date(b.date_echeance))[0];
      if (overdue) {
        const days = Math.floor((new Date() - new Date(overdue.date_echeance)) / 86400000);
        setOverdueInvoice({ ...overdue, days });
      }
    });
  }, []);

  const max = clients[0]?.total_facture || 1;

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>
          Top clients
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Par chiffre d'affaires
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {clients.map((c, i) => {
          const pct = Math.round((parseFloat(c.total_facture || 0) / max) * 100);
          return (
            <Box key={c.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b' }}>{c.nom}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                  {Number(c.total_facture || 0).toLocaleString('fr-MA')} DH
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={pct}
                sx={{ height: 6, borderRadius: 5, bgcolor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': { bgcolor: COLORS[i] || '#cbd5e1', borderRadius: 5 } }} />
            </Box>
          );
        })}
      </Box>

      {overdueInvoice && (
        <Box sx={{
          mt: 3, p: 1.5, borderRadius: 2,
          bgcolor: '#fff7ed', border: '1px solid #fed7aa',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberRoundedIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
            <Box>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400e' }}>
                Facture impayée — {overdueInvoice.days} jours
              </Typography>
              <Typography sx={{ fontSize: '0.68rem', color: '#b45309' }}>
                {overdueInvoice.numero_facture} · {overdueInvoice.client?.nom}
              </Typography>
            </Box>
          </Box>
          <Chip label="Relancer" size="small"
            sx={{ fontSize: '0.65rem', bgcolor: '#f59e0b', color: 'white', fontWeight: 700, cursor: 'pointer',
              '&:hover': { bgcolor: '#d97706' } }} />
        </Box>
      )}
    </Box>
  );
};

export default TopClients;