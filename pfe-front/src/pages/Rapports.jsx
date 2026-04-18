import React, { useState, useMemo, useRef } from 'react';
import {
  Box, Typography, Button, Chip, MenuItem,
  TextField, Divider, Snackbar, Alert,
} from '@mui/material';
import {
  BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF      from 'jspdf';
import Navbar from '../components/Navbar';

// ── Icons ────────────────────────────────────────────────────
import DownloadRoundedIcon        from '@mui/icons-material/DownloadRounded';
import TrendingUpRoundedIcon      from '@mui/icons-material/TrendingUpRounded';
import PaidRoundedIcon            from '@mui/icons-material/PaidRounded';
import HourglassEmptyRoundedIcon  from '@mui/icons-material/HourglassEmptyRounded';
import PercentRoundedIcon         from '@mui/icons-material/PercentRounded';

// ════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════

const ALL_MONTHLY = {
  '2025': [
    { month: 'Jan', revenus: 28000, cible: 30000, factures: 18, payees: 14 },
    { month: 'Fév', revenus: 32000, cible: 30000, factures: 21, payees: 17 },
    { month: 'Mar', revenus: 27500, cible: 32000, factures: 19, payees: 13 },
    { month: 'Avr', revenus: 35000, cible: 32000, factures: 24, payees: 20 },
    { month: 'Mai', revenus: 38000, cible: 35000, factures: 26, payees: 21 },
    { month: 'Jun', revenus: 33000, cible: 35000, factures: 22, payees: 18 },
    { month: 'Jul', revenus: 29000, cible: 35000, factures: 20, payees: 15 },
    { month: 'Aoû', revenus: 25000, cible: 35000, factures: 16, payees: 11 },
    { month: 'Sep', revenus: 37000, cible: 38000, factures: 25, payees: 21 },
    { month: 'Oct', revenus: 41000, cible: 38000, factures: 28, payees: 24 },
    { month: 'Nov', revenus: 43000, cible: 40000, factures: 30, payees: 26 },
    { month: 'Déc', revenus: 47000, cible: 42000, factures: 32, payees: 29 },
  ],
  '2026': [
    { month: 'Jan', revenus: 32000, cible: 35000, factures: 20, payees: 16 },
    { month: 'Fév', revenus: 28000, cible: 35000, factures: 18, payees: 13 },
    { month: 'Mar', revenus: 38500, cible: 40000, factures: 25, payees: 20 },
    { month: 'Avr', revenus: 45200, cible: 42000, factures: 30, payees: 26 },
  ],
};

const STATUS_DATA = [
  { name: 'Payées',      value: 78, color: '#10b981' },
  { name: 'En attente',  value: 34, color: '#f59e0b' },
  { name: 'En retard',   value: 16, color: '#ef4444' },
  { name: 'Brouillon',   value:  8, color: '#94a3b8' },
];

const TOP_CLIENTS = [
  { name: 'OCP Group',         ca: 45200 },
  { name: 'Maroc Telecom',     ca: 38400 },
  { name: 'Attijariwafa Bank', ca: 29600 },
  { name: 'BMCE Bank',         ca: 21000 },
  { name: 'Centrale Danone',   ca: 17800 },
  { name: 'Cosumar',           ca: 12400 },
];

const YEARS = ['2025', '2026'];

// ── Reusable pieces ──────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color, trend }) => (
  <Box sx={{
    flex: '1 1 180px', bgcolor: 'white', border: '1px solid #e2e8f0',
    borderRadius: 3, p: 2.5, position: 'relative', overflow: 'hidden',
    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', bgcolor: color },
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {label}
      </Typography>
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

const CardWrap = ({ title, sub, children, action }) => (
  <Box sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 3, p: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>{title}</Typography>
        {sub && <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 0.3 }}>{sub}</Typography>}
      </Box>
      {action}
    </Box>
    {children}
  </Box>
);

// Custom tooltip for recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 2, p: 1.5, boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}>
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

// ════════════════════════════════════════════════════════════
export default function Rapports() {
  const [year, setYear]         = useState('2026');
  const [downloading, setDownloading] = useState(false);
  const [snack, setSnack]       = useState({ open: false, msg: '', severity: 'success' });
  const reportRef               = useRef();

  const monthly = ALL_MONTHLY[year] || [];

  // ── Computed KPIs ──────────────────────────────────────────
  const kpis = useMemo(() => {
    const totalRev   = monthly.reduce((s, m) => s + m.revenus, 0);
    const totalFact  = monthly.reduce((s, m) => s + m.factures, 0);
    const totalPaid  = monthly.reduce((s, m) => s + m.payees, 0);
    const recovRate  = totalFact > 0 ? Math.round((totalPaid / totalFact) * 100) : 0;
    const pending    = STATUS_DATA.find(s => s.name === 'En attente')?.value || 0;
    const pendingAmt = Math.round(totalRev * 0.22); // approx
    return { totalRev, totalFact, recovRate, pendingAmt, pending };
  }, [monthly]);

  // ── PDF export of the whole report ────────────────────────
  const exportPDF = async () => {
    setDownloading(true);
    try {
      const el = reportRef.current;
      const canvas = await html2canvas(el, { scale: 1.5, useCORS: true, backgroundColor: '#f8fafc' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pdfW) / canvas.width;

      let yPos = 0;
      let remaining = imgH;
      let page = 0;

      // Slice image across multiple A4 pages
      while (remaining > 0) {
        if (page > 0) pdf.addPage();
        const sliceH  = Math.min(pdfH, remaining);
        const srcY    = page * (canvas.height * pdfH / imgH);
        const srcH    = sliceH * (canvas.height / imgH);

        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width  = canvas.width;
        sliceCanvas.height = srcH;
        sliceCanvas.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, sliceH);

        remaining -= pdfH;
        yPos      += pdfH;
        page++;
      }

      pdf.save(`Rapport-InvoiceFlow-${year}.pdf`);
      setSnack({ open: true, msg: `Rapport ${year} exporté avec succès`, severity: 'success' });
    } catch {
      setSnack({ open: true, msg: 'Erreur lors de l\'export', severity: 'error' });
    }
    setDownloading(false);
  };

  const tick = { fontSize: 11, fill: '#94a3b8' };
  const grid = { strokeDasharray: '3 3', vertical: false, stroke: '#f1f5f9' };

  // ── Render ─────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── Page header ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>Rapports</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.4 }}>
              Analyse financière et suivi de performance
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Year selector */}
            <TextField
              select size="small" value={year}
              onChange={e => setYear(e.target.value)}
              sx={{ width: 110, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white', fontSize: '0.85rem' } }}
            >
              {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </TextField>

            {/* Export PDF */}
            <Button
              startIcon={<DownloadRoundedIcon />}
              onClick={exportPDF}
              disabled={downloading}
              variant="contained"
              sx={{
                bgcolor: '#0f172a', color: 'white', fontWeight: 700,
                borderRadius: '10px', px: 3, py: 1.2,
                textTransform: 'none', fontSize: '0.85rem',
                boxShadow: 'none', '&:hover': { bgcolor: '#1e293b', boxShadow: 'none' },
              }}
            >
              {downloading ? 'Export en cours…' : 'Exporter PDF'}
            </Button>
          </Box>
        </Box>

        {/* ══════════════════════════════════════════════════
            Everything below this div gets captured for PDF
        ══════════════════════════════════════════════════ */}
        <Box ref={reportRef} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Report title bar (visible in PDF) */}
          <Box sx={{ bgcolor: '#0f172a', borderRadius: 3, px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <img src="/logo invoice.jpg" alt="Logo" style={{ height: '35px', marginRight: '10px' }} />
              <Box>
                <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>InvoiceFlow — Rapport annuel {year}</Typography>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>Généré le {new Date().toLocaleDateString('fr-MA')}</Typography>
              </Box>
            </Box>
            <Chip label={year} sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 700, fontSize: '0.78rem' }} />
          </Box>

          {/* ── KPI cards ── */}
          <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
            <StatCard
              icon={<TrendingUpRoundedIcon sx={{ fontSize: 18 }} />}
              label="Chiffre d'affaires"
              value={`${kpis.totalRev.toLocaleString('fr-MA')} DH`}
              sub="vs objectif annuel" trend="up" color="#10b981"
            />
            <StatCard
              icon={<PaidRoundedIcon sx={{ fontSize: 18 }} />}
              label="Factures émises"
              value={kpis.totalFact}
              sub={`${monthly.reduce((s,m)=>s+m.payees,0)} payées`} trend="up" color="#3b82f6"
            />
            <StatCard
              icon={<PercentRoundedIcon sx={{ fontSize: 18 }} />}
              label="Taux de recouvrement"
              value={`${kpis.recovRate}%`}
              sub="Objectif : 90%" trend={kpis.recovRate >= 90 ? 'up' : 'down'} color="#8b5cf6"
            />
            <StatCard
              icon={<HourglassEmptyRoundedIcon sx={{ fontSize: 18 }} />}
              label="Montant en attente"
              value={`${kpis.pendingAmt.toLocaleString('fr-MA')} DH`}
              sub={`${kpis.pending} factures`} trend="down" color="#f59e0b"
            />
          </Box>

          {/* ── Row 1: Revenue chart + Status donut ── */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>

            {/* Revenue area chart */}
            <Box sx={{ flex: '1 1 420px' }}>
              <CardWrap
                title="Évolution du chiffre d'affaires"
                sub={`Revenus mensuels vs objectif — ${year}`}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={monthly}>
                    <defs>
                      <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradCible" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.08} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...grid} />
                    <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `${v/1000}k`} tick={tick} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenus" name="Revenus" stroke="#10b981" strokeWidth={2} fill="url(#gradRev)" dot={{ r: 3, fill: '#10b981' }} />
                    <Area type="monotone" dataKey="cible"   name="Cible"   stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 4" fill="url(#gradCible)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {[{ color: '#10b981', label: 'Revenus réels' }, { color: '#3b82f6', label: 'Objectif' }].map(l => (
                    <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: l.color }} />
                      <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>{l.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardWrap>
            </Box>

            {/* Status donut */}
            <Box sx={{ flex: '0 1 300px', minWidth: 260 }}>
              <CardWrap title="Statut des factures" sub="Répartition par statut">
                <Box sx={{ position: 'relative', height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={STATUS_DATA} cx="50%" cy="50%" innerRadius={58} outerRadius={82} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {STATUS_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v, name) => [`${v} factures`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center */}
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                      {STATUS_DATA.reduce((s, d) => s + d.value, 0)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.04em' }}>total</Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: '#f1f5f9', my: 1.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {STATUS_DATA.map(d => {
                    const total = STATUS_DATA.reduce((s, x) => s + x.value, 0);
                    return (
                      <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: d.color }} />
                          <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>{d.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>{d.value}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>({Math.round(d.value/total*100)}%)</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </CardWrap>
            </Box>
          </Box>

          {/* ── Row 2: Monthly bar chart ── */}
          <CardWrap
            title="Volume mensuel de facturation"
            sub={`Nombre de factures émises et payées par mois — ${year}`}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthly} barGap={4}>
                <CartesianGrid {...grid} />
                <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="factures" name="Émises" fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={28} />
                <Bar dataKey="payees"   name="Payées"  fill="#10b981" radius={[4,4,0,0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              {[{ color: '#3b82f6', label: 'Émises' }, { color: '#10b981', label: 'Payées' }].map(l => (
                <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: l.color }} />
                  <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>{l.label}</Typography>
                </Box>
              ))}
            </Box>
          </CardWrap>

          {/* ── Row 3: Top clients horizontal bar ── */}
          <CardWrap title="Top clients par chiffre d'affaires" sub="Classement des 6 meilleurs clients">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {TOP_CLIENTS.map((c, i) => {
                const max = TOP_CLIENTS[0].ca;
                const pct = Math.round((c.ca / max) * 100);
                const colors = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4'];
                return (
                  <Box key={c.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', minWidth: 16 }}>#{i+1}</Typography>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>{c.name}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
                        {c.ca.toLocaleString('fr-MA')} DH
                      </Typography>
                    </Box>
                    <Box sx={{ height: 8, bgcolor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: colors[i], borderRadius: 4, transition: 'width .6s ease' }} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </CardWrap>

          {/* ── Row 4: Summary table ── */}
          <CardWrap title="Récapitulatif mensuel" sub={`Détail mois par mois — ${year}`}>
            <Box sx={{ overflowX: 'auto' }}>
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <Box component="thead">
                  <Box component="tr">
                    {['Mois','Revenus','Cible','Écart','Factures émises','Payées','Taux'].map(h => (
                      <Box key={h} component="th" sx={{ textAlign: h === 'Mois' ? 'left' : 'right', py: 1, px: 1.5, fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                        {h}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box component="tbody">
                  {monthly.map((m, i) => {
                    const ecart = m.revenus - m.cible;
                    const taux  = Math.round((m.payees / m.factures) * 100);
                    return (
                      <Box key={m.month} component="tr" sx={{ bgcolor: i % 2 === 1 ? '#fafafa' : 'white', '&:hover': { bgcolor: '#f0fdf4' } }}>
                        <Box component="td" sx={{ py: 1.2, px: 1.5, fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{m.month}</Box>
                        <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{m.revenus.toLocaleString('fr-MA')} DH</Box>
                        <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>{m.cible.toLocaleString('fr-MA')} DH</Box>
                        <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', fontWeight: 600, color: ecart >= 0 ? '#10b981' : '#ef4444', borderBottom: '1px solid #f1f5f9' }}>
                          {ecart >= 0 ? '+' : ''}{ecart.toLocaleString('fr-MA')} DH
                        </Box>
                        <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>{m.factures}</Box>
                        <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>{m.payees}</Box>
                        <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, px: 1, py: 0.3, borderRadius: 10, bgcolor: taux >= 80 ? '#d1fae5' : taux >= 60 ? '#fef3c7' : '#fee2e2' }}>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: taux >= 80 ? '#065f46' : taux >= 60 ? '#92400e' : '#991b1b' }}>
                              {taux}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Totals row */}
                <Box component="tfoot">
                  <Box component="tr" sx={{ bgcolor: '#0f172a' }}>
                    <Box component="td" sx={{ py: 1.2, px: 1.5, fontWeight: 800, color: 'white', borderTop: '2px solid #1e293b' }}>Total</Box>
                    <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', fontWeight: 800, color: '#10b981', borderTop: '2px solid #1e293b' }}>
                      {monthly.reduce((s,m)=>s+m.revenus,0).toLocaleString('fr-MA')} DH
                    </Box>
                    <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', color: '#64748b', borderTop: '2px solid #1e293b' }}>
                      {monthly.reduce((s,m)=>s+m.cible,0).toLocaleString('fr-MA')} DH
                    </Box>
                    <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', fontWeight: 700, color: '#10b981', borderTop: '2px solid #1e293b' }}>
                      {(() => { const e = monthly.reduce((s,m)=>s+m.revenus-m.cible,0); return (e>=0?'+':'')+e.toLocaleString('fr-MA')+' DH'; })()}
                    </Box>
                    <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', color: 'white', borderTop: '2px solid #1e293b' }}>
                      {monthly.reduce((s,m)=>s+m.factures,0)}
                    </Box>
                    <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', color: 'white', borderTop: '2px solid #1e293b' }}>
                      {monthly.reduce((s,m)=>s+m.payees,0)}
                    </Box>
                    <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right', borderTop: '2px solid #1e293b' }}>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981' }}>
                        {kpis.recovRate}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardWrap>

          {/* Footer in PDF */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #e2e8f0' }}>
            <Typography sx={{ fontSize: '0.68rem', color: '#cbd5e1' }}>InvoiceFlow · Rapport généré automatiquement</Typography>
            <Typography sx={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Année {year}</Typography>
          </Box>

        </Box>{/* end reportRef */}
      </Box>

      {/* Toast */}
      <Snackbar open={snack.open} autoHideDuration={3500}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled"
          sx={{ borderRadius: 2, fontWeight: 600, fontSize: '0.82rem' }}
          onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
