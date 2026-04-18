import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Payées',     value: 78, color: '#10b981' },
  { name: 'En attente', value: 34, color: '#f59e0b' },
  { name: 'En retard',  value: 16, color: '#ef4444' },
];

const total = data.reduce((s, d) => s + d.value, 0);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <Box sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 2, p: 1.5 }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: d.payload.color }}>{d.name}</Typography>
      <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>
        {d.value} factures ({((d.value / total) * 100).toFixed(1)}%)
      </Typography>
    </Box>
  );
};

const DonutChart = () => (
  <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, border: '1px solid #e2e8f0', flex: '1 1 300px' }}>
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>
        Statut des factures
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {total} factures au total
      </Typography>
    </Box>

    <Box sx={{ position: 'relative', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none',
      }}>
        <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
          {total}
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>
          total
        </Typography>
      </Box>
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
      {data.map((d) => (
        <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: d.color }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>{d.name}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>{d.value}</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              ({((d.value / total) * 100).toFixed(0)}%)
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

export default DonutChart;
