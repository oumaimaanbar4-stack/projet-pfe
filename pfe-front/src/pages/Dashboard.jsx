import React from 'react';
import { Box, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import RevenueChart from '../components/RevenueChart';
import DonutChart from '../components/DonutChart';
import RecentInvoices from '../components/RecentInvoices';
import TopClients from '../components/TopClients';

const Dashboard = () => {
  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      <Navbar />

      <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: '1600px', margin: '0 auto' }}>

        {/* Page header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
            Vue d'ensemble
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Avril 2026 
          </Typography>
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
