import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 2, p: 1.5, fontSize: '0.75rem' }}>
      <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.75rem', color: '#1e293b' }}>{label}</Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color }} />
          <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>
            {p.name} : <strong>{Number(p.value).toLocaleString('fr-MA')} DH</strong>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const MONTH_LABELS = { '01':'Jan','02':'Fév','03':'Mar','04':'Avr','05':'Mai','06':'Jun','07':'Jul','08':'Aoû','09':'Sep','10':'Oct','11':'Nov','12':'Déc' };

const RevenueChart = () => {
  const [mode, setMode] = useState('bar');
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/dashboard/revenue').then(res => {
      const formatted = res.data.map(item => ({
        month: MONTH_LABELS[item.month.split('-')[1]] || item.month,
        revenus: parseFloat(item.total),
      }));
      setData(formatted);
    });
  }, []);

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, border: '1px solid #e2e8f0', flex: '1 1 500px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>
            Revenus mensuels
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>6 derniers mois</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['bar', 'area'].map((m) => (
            <Chip key={m} label={m === 'bar' ? 'Barres' : 'Aire'} size="small" onClick={() => setMode(m)}
              sx={{ fontSize: '0.7rem', fontWeight: 700, bgcolor: mode === m ? '#10b981' : '#f1f5f9', color: mode === m ? 'white' : '#64748b', cursor: 'pointer', '&:hover': { bgcolor: mode === m ? '#059669' : '#e2e8f0' } }}
            />
          ))}
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={260}>
        {mode === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenus" name="Revenus" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={36} />
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenus" name="Revenus" stroke="#10b981" strokeWidth={2} fill="url(#colorRev)" dot={{ r: 4, fill: '#10b981' }} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueChart;