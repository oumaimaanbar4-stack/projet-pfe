import React, { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', revenus: 32000, cible: 35000 },
  { month: 'Fév', revenus: 28000, cible: 35000 },
  { month: 'Mar', revenus: 38500, cible: 40000 },
  { month: 'Avr', revenus: 45200, cible: 42000 },
  { month: 'Mai', revenus: 41000, cible: 43000 },
  { month: 'Jun', revenus: 47800, cible: 45000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 2, p: 1.5, fontSize: '0.75rem' }}>
      <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.75rem', color: '#1e293b' }}>{label}</Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color }} />
          <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>
            {p.name} : <strong>{p.value.toLocaleString('fr-MA')} DH</strong>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const RevenueChart = () => {
  const [mode, setMode] = useState('bar');

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, border: '1px solid #e2e8f0', flex: '1 1 500px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>
            Revenus mensuels
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Janvier — Juin 2026
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['bar', 'area'].map((m) => (
            <Chip
              key={m}
              label={m === 'bar' ? 'Barres' : 'Aire'}
              size="small"
              onClick={() => setMode(m)}
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                bgcolor: mode === m ? '#10b981' : '#f1f5f9',
                color: mode === m ? 'white' : '#64748b',
                border: 'none',
                cursor: 'pointer',
                '&:hover': { bgcolor: mode === m ? '#059669' : '#e2e8f0' },
              }}
            />
          ))}
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={260}>
        {mode === 'bar' ? (
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenus" name="Revenus" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={36} />
            <Bar dataKey="cible" name="Cible" fill="#d1fae5" radius={[5, 5, 0, 0]} maxBarSize={36} />
          </BarChart>
        ) : (
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCible" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenus" name="Revenus" stroke="#10b981" strokeWidth={2} fill="url(#colorRev)" dot={{ r: 4, fill: '#10b981' }} />
            <Area type="monotone" dataKey="cible" name="Cible" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 4" fill="url(#colorCible)" dot={false} />
          </AreaChart>
        )}
      </ResponsiveContainer>

      <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
        {[{ color: '#10b981', label: 'Revenus réels' }, { color: '#d1fae5', label: 'Cible mensuelle' }].map((l) => (
          <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: l.color }} />
            <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>{l.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RevenueChart;
