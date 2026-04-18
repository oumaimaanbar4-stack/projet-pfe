import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const stats = [
  {
    label: "Chiffre d'affaires",
    value: '45 200.00 DH',
    sub: '↑ 12% vs mois dernier',
    subColor: 'success.main',
    color: '#10b981',
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 22 }} />,
  },
  {
    label: 'Volume de facturation',
    value: '128 Factures',
    sub: 'Moyenne : 4.2/jour',
    subColor: 'primary.main',
    color: '#3b82f6',
    icon: <ReceiptLongIcon sx={{ fontSize: 22 }} />,
  },
  {
    label: 'Taux de recouvrement',
    value: '84.5%',
    sub: null,
    color: '#8b5cf6',
    icon: <AnalyticsIcon sx={{ fontSize: 22 }} />,
    progress: 84.5,
  },
  {
    label: 'Clients actifs',
    value: '34',
    sub: '↑ 3 nouveaux ce mois',
    subColor: 'success.main',
    color: '#f59e0b',
    icon: <PeopleAltIcon sx={{ fontSize: 22 }} />,
  },
];

const StatsCards = () => (
  <Box sx={{ display: 'flex', gap: 3, width: '100%', mb: 4, flexWrap: 'wrap' }}>
    {stats.map((card, i) => (
      <Box
        key={i}
        sx={{
          flex: '1 1 200px',
          p: 3,
          borderRadius: 3,
          bgcolor: 'white',
          border: '1px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow .2s',
          '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,.07)' },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '3px',
            bgcolor: card.color,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '.05em', fontSize: '0.65rem' }}
          >
            {card.label}
          </Typography>
          <Box sx={{ color: card.color, bgcolor: `${card.color}18`, p: 0.8, borderRadius: 1.5, display: 'flex' }}>
            {card.icon}
          </Box>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>
          {card.value}
        </Typography>

        {card.progress !== undefined ? (
          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={card.progress}
              sx={{
                height: 6,
                borderRadius: 5,
                bgcolor: '#f1f5f9',
                '& .MuiLinearProgress-bar': { bgcolor: card.color },
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              Objectif : 90%
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 600, color: card.subColor, fontSize: '0.75rem' }}>
            {card.sub}
          </Typography>
        )}
      </Box>
    ))}
  </Box>
);

export default StatsCards;
