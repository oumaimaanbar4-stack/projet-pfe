import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, Chip } from '@mui/material';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import RevenueChart from '../components/RevenueChart';
import DonutChart from '../components/DonutChart';
import RecentInvoices from '../components/RecentInvoices';
import TopClients from '../components/TopClients';

const Dashboard = () => {
  const [period, setPeriod] = useState('Ce mois');

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      <Navbar />

      <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: '1600px', margin: '0 auto' }}>

        {/* ── Page header: "Vue d'ensemble"  +  badge  +  selector ── */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
            Vue d'ensemble
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Green date badge — matches dark screenshot */}
            <Chip
              label={new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              sx={{
                bgcolor: '#10b981',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.78rem',
                height: 32,
                borderRadius: '8px',
                px: 0.5,
                textTransform: 'capitalize',
              }}
            />

            {/* Period dropdown */}
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              size="small"
              sx={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#1e293b',
                bgcolor: 'white',
                borderRadius: '10px',
                height: 36,
                minWidth: 130,
                border: '1px solid #e2e8f0',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': { py: '7px' },
              }}
            >
              <MenuItem value="Ce mois">Ce mois</MenuItem>
              <MenuItem value="Trimestre">Trimestre</MenuItem>
              <MenuItem value="Année">Année</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* KPI cards */}
        <StatsCards />

        {/* Charts row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <RevenueChart />
          <DonutChart />
        </Box>

        {/* Bottom row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <RecentInvoices />
          <TopClients />
        </Box>

      </Box>
    </Box>
  );
};

export default Dashboard;
