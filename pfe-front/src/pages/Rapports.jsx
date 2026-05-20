import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box, Typography, Button, Chip, MenuItem,
  TextField, Divider, Snackbar, Alert,
} from '@mui/material';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';
import api from '../services/api';

import DownloadRoundedIcon       from '@mui/icons-material/DownloadRounded';
import TrendingUpRoundedIcon     from '@mui/icons-material/TrendingUpRounded';
import PaidRoundedIcon           from '@mui/icons-material/PaidRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import PercentRoundedIcon        from '@mui/icons-material/PercentRounded';

const MONTH_LABELS = {'01':'Jan','02':'Fév','03':'Mar','04':'Avr','05':'Mai','06':'Jun','07':'Jul','08':'Aoû','09':'Sep','10':'Oct','11':'Nov','12':'Déc'};

const StatCard = ({ icon, label, value, sub, color, trend }) => (
  <Box sx={{
    flex: '1 1 180px', bgcolor: 'white', border: '1px solid #e2e8f0',
    borderRadius: 3, p: 2.5, position: 'relative', overflow: 'hidden',
    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', bgcolor: color },
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</Typography>
      <Box sx={{ bgcolor: `${color}18`, color, p: 0.7, borderRadius: 1.5, display: 'flex' }}>{icon}</Box>
    </Box>
    <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{value}</Typography>
    {sub && (
      <Typography sx={{ fontSize: '0.72rem', mt: 0.5, fontWeight: 600, color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#94a3b8' }}>
        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {sub}
      </Typography>
    )}
  </Box>
);

const CardWrap = ({ title, sub, children }) => (
  <Box sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 3, p: 3 }}>
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>{title}</Typography>
      {sub && <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 0.3 }}>{sub}</Typography>}
    </Box>
    {children}
  </Box>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 2, p: 1.5 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#1e293b', mb: 0.5 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color }} />
          <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>
            {p.name} : <strong>{typeof p.value === 'number' && p.value > 1000 ? p.value.toLocaleString('fr-MA') + ' DH' : p.value}</strong>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function Rapports() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [statsData, setStatsData]     = useState(null);
  const [topClients, setTopClients]   = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [snack, setSnack]             = useState({ open: false, msg: '', severity: 'success' });
  const reportRef = useRef();

  useEffect(() => {
    api.get('/dashboard/revenue').then(res => {
      setMonthlyData(res.data.map(item => ({
        month:   MONTH_LABELS[item.month.split('-')[1]] || item.month,
        revenus: parseFloat(item.total),
        cible:   parseFloat(item.total) * 1.1,
      })));
    });
    api.get('/dashboard/stats').then(res => setStatsData(res.data));
    api.get('/dashboard/top-clients').then(res => setTopClients(res.data));
  }, []);

  const statusData = statsData ? [
    { name: 'Payées',     value: statsData.paid_count,    color: '#10b981' },
    { name: 'En attente', value: statsData.pending_count,  color: '#f59e0b' },
    { name: 'En retard',  value: statsData.overdue_count,  color: '#ef4444' },
  ] : [];

  const kpis = useMemo(() => {
    if (!statsData) return { totalRev: 0, totalFact: 0, recovRate: 0, pendingAmt: 0 };
    const totalRev  = parseFloat(statsData.total_revenue || 0);
    const totalFact = statsData.total_invoices || 0;
    const paidCount = statsData.paid_count || 0;
    const recovRate = totalFact > 0 ? Math.round((paidCount / totalFact) * 100) : 0;
    const pendingAmt = parseFloat(statsData.pending_amount || 0);
    return { totalRev, totalFact, recovRate, pendingAmt, paidCount };
  }, [statsData]);

  const exportPDF = async () => {
    setDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 1.5, useCORS: true, backgroundColor: '#f8fafc' });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pdfW) / canvas.width;
      let remaining = imgH, page = 0;
      while (remaining > 0) {
        if (page > 0) pdf.addPage();
        const sliceH = Math.min(pdfH, remaining);
        const srcY = page * (canvas.height * pdfH / imgH);
        const srcH = sliceH * (canvas.height / imgH);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width; sliceCanvas.height = srcH;
        sliceCanvas.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, sliceH);
        remaining -= pdfH; page++;
      }
      pdf.save(`Rapport-InvoiceFlow.pdf`);
      setSnack({ open: true, msg: 'Rapport exporté avec succès', severity: 'success' });
    } catch {
      setSnack({ open: true, msg: "Erreur lors de l'export", severity: 'error' });
    }
    setDownloading(false);
  };

  const tick = { fontSize: 11, fill: '#94a3b8' };
  const grid = { strokeDasharray: '3 3', vertical: false, stroke: '#f1f5f9' };
  const maxCA = topClients[0]?.total_facture || 1;
  const colors = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4'];

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>Rapports</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.4 }}>Analyse financière et suivi de performance</Typography>
          </Box>
          <Button startIcon={<DownloadRoundedIcon />} onClick={exportPDF} disabled={downloading} variant="contained"
            sx={{ bgcolor: '#0f172a', color: 'white', fontWeight: 700, borderRadius: '10px', px: 3, py: 1.2, textTransform: 'none', fontSize: '0.85rem', boxShadow: 'none', '&:hover': { bgcolor: '#1e293b', boxShadow: 'none' } }}>
            {downloading ? 'Export en cours…' : 'Exporter PDF'}
          </Button>
        </Box>

        <Box ref={reportRef} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Header bar */}
          <Box sx={{ bgcolor: '#0f172a', borderRadius: 3, px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <img src="/logo invoice.jpg" alt="Logo" style={{ height: '35px', marginRight: '10px' }} />
              <Box>
                <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>InvoiceFlow — Rapport</Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>Généré le {new Date().toLocaleDateString('fr-MA')}</Typography>
              </Box>
            </Box>
          </Box>

          {/* KPIs */}
          <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
            <StatCard icon={<TrendingUpRoundedIcon sx={{ fontSize: 18 }} />} label="Chiffre d'affaires" value={`${kpis.totalRev.toLocaleString('fr-MA')} DH`} sub="revenus encaissés" trend="up" color="#10b981" />
            <StatCard icon={<PaidRoundedIcon sx={{ fontSize: 18 }} />} label="Factures émises" value={kpis.totalFact} sub={`${kpis.paidCount || 0} payées`} trend="up" color="#3b82f6" />
            <StatCard icon={<PercentRoundedIcon sx={{ fontSize: 18 }} />} label="Taux de recouvrement" value={`${kpis.recovRate}%`} sub="Objectif : 90%" trend={kpis.recovRate >= 90 ? 'up' : 'down'} color="#8b5cf6" />
            <StatCard icon={<HourglassEmptyRoundedIcon sx={{ fontSize: 18 }} />} label="Montant en attente" value={`${kpis.pendingAmt.toLocaleString('fr-MA')} DH`} sub={`${statsData?.pending_count || 0} factures`} trend="down" color="#f59e0b" />
          </Box>

          {/* Revenue + Donut */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 420px' }}>
              <CardWrap title="Évolution du chiffre d'affaires" sub="Revenus mensuels — 6 derniers mois">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...grid} />
                    <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `${v/1000}k`} tick={tick} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenus" name="Revenus" stroke="#10b981" strokeWidth={2} fill="url(#gradRev)" dot={{ r: 3, fill: '#10b981' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardWrap>
            </Box>

            <Box sx={{ flex: '0 1 300px', minWidth: 260 }}>
              <CardWrap title="Statut des factures" sub="Répartition par statut">
                <Box sx={{ position: 'relative', height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={58} outerRadius={82} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v, name) => [`${v} factures`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                      {statusData.reduce((s, d) => s + d.value, 0)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.04em' }}>total</Typography>
                  </Box>
                </Box>
                <Divider sx={{ borderColor: '#f1f5f9', my: 1.5 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {statusData.map(d => {
                    const total = statusData.reduce((s, x) => s + x.value, 0);
                    return (
                      <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: d.color }} />
                          <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>{d.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>{d.value}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>({total > 0 ? Math.round(d.value/total*100) : 0}%)</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </CardWrap>
            </Box>
          </Box>

          {/* Top clients */}
          <CardWrap title="Top clients par chiffre d'affaires" sub="Classement des meilleurs clients">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {topClients.map((c, i) => {
                const pct = Math.round((parseFloat(c.total_facture || 0) / maxCA) * 100);
                return (
                  <Box key={c.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', minWidth: 16 }}>#{i+1}</Typography>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>{c.nom}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
                        {Number(c.total_facture || 0).toLocaleString('fr-MA')} DH
                      </Typography>
                    </Box>
                    <Box sx={{ height: 8, bgcolor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: colors[i] || '#94a3b8', borderRadius: 4, transition: 'width .6s ease' }} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </CardWrap>

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #e2e8f0' }}>
            <Typography sx={{ fontSize: '0.68rem', color: '#cbd5e1' }}>InvoiceFlow · Rapport généré automatiquement</Typography>
            <Typography sx={{ fontSize: '0.68rem', color: '#cbd5e1' }}>{new Date().toLocaleDateString('fr-MA')}</Typography>
          </Box>

        </Box>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 600, fontSize: '0.82rem' }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}