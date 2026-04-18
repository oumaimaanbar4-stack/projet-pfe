import React, { useState, useMemo, useRef } from 'react';
import {
  Box, Typography, Button, Drawer, TextField, IconButton,
  InputAdornment, Chip, Tooltip, Dialog, DialogContent,
  MenuItem, Divider, Snackbar, Alert, Avatar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';
import InvoicePDF from '../components/InvoicePDF';

// ── Icons ────────────────────────────────────────────────────
import AddRoundedIcon           from '@mui/icons-material/AddRounded';
import SearchRoundedIcon        from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon    from '@mui/icons-material/FilterListRounded';
import DownloadRoundedIcon      from '@mui/icons-material/DownloadRounded';
import VisibilityRoundedIcon    from '@mui/icons-material/VisibilityRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CloseRoundedIcon         from '@mui/icons-material/CloseRounded';
import ReceiptLongRoundedIcon   from '@mui/icons-material/ReceiptLongRounded';
import PaidRoundedIcon          from '@mui/icons-material/PaidRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import WarningAmberRoundedIcon  from '@mui/icons-material/WarningAmberRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';

// ── Constants ────────────────────────────────────────────────
const CLIENTS  = ['OCP Group','Maroc Telecom','Attijariwafa Bank','BMCE Bank','Centrale Danone','Cosumar'];
const STATUTS  = ['En attente','Payée','En retard','Brouillon'];
const VILLES   = ['Casablanca','Rabat','Salé','Marrakech','Fès','Tanger'];

const STATUT_STYLE = {
  'Payée':      { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  'En attente': { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  'En retard':  { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
  'Brouillon':  { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
};

const EMPTY_ITEM  = { description: '', qty: 1, unitPrice: 0 };
const EMPTY_FORM  = {
  client: '', ville: 'Casablanca', dateEmission: '', dateEcheance: '',
  statut: 'En attente', items: [{ ...EMPTY_ITEM }], tax: 20, discount: 0, notes: '',
};

// ── Seed data ────────────────────────────────────────────────
let idCounter = 5;
const SEED = [
  { id: 1, numero: 'FAC-2026-001', client: 'OCP Group',         ville: 'Casablanca', dateEmission: '2026-01-10', dateEcheance: '2026-02-10', statut: 'Payée',      items: [{ description: 'Conseil stratégique', qty: 5, unitPrice: 1500 }], tax: 20, discount: 0,  notes: 'Merci pour votre confiance.' },
  { id: 2, numero: 'FAC-2026-002', client: 'Maroc Telecom',     ville: 'Rabat',      dateEmission: '2026-02-01', dateEcheance: '2026-03-01', statut: 'En attente', items: [{ description: 'Développement app',    qty: 3, unitPrice: 2000 }, { description: 'Support technique', qty: 10, unitPrice: 200 }], tax: 20, discount: 5, notes: '' },
  { id: 3, numero: 'FAC-2026-003', client: 'Attijariwafa Bank', ville: 'Casablanca', dateEmission: '2026-02-15', dateEcheance: '2026-03-15', statut: 'En retard',  items: [{ description: 'Audit informatique',  qty: 2, unitPrice: 2500 }], tax: 20, discount: 0,  notes: 'Relance envoyée le 20/03.' },
  { id: 4, numero: 'FAC-2026-004', client: 'BMCE Bank',         ville: 'Casablanca', dateEmission: '2026-03-01', dateEcheance: '2026-04-01', statut: 'Brouillon',  items: [{ description: 'Formation équipe',    qty: 8, unitPrice: 750 }],  tax: 20, discount: 10, notes: '' },
];

// ── Helpers ──────────────────────────────────────────────────
const calcTotal = (facture) => {
  const sub  = facture.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tax  = sub * (facture.tax / 100);
  const disc = sub * (facture.discount / 100);
  return sub + tax - disc;
};

const avatarColor = (name = '') => {
  const p = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4'];
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) % p.length;
  return p[h];
};

// ── Stat card ────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, sub }) => (
  <Box sx={{
    flex: '1 1 180px', bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 3, p: 2.5,
    position: 'relative', overflow: 'hidden',
    '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', bgcolor: color },
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</Typography>
      <Box sx={{ bgcolor: `${color}18`, color, p: 0.7, borderRadius: 1.5, display: 'flex' }}>{icon}</Box>
    </Box>
    <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{value}</Typography>
    {sub && <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', mt: 0.5 }}>{sub}</Typography>}
  </Box>
);

// ════════════════════════════════════════════════════════════
export default function Factures() {
  const [rows, setRows]                 = useState(SEED);
  const [search, setSearch]             = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]     = useState({});
  const [previewFacture, setPreviewFacture] = useState(null);
  const [downloading, setDownloading]   = useState(false);
  const [snack, setSnack]               = useState({ open: false, msg: '', severity: 'success' });
  const pdfRef = useRef();

  // ── Stats ──────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:    rows.length,
    payees:   rows.filter(r => r.statut === 'Payée').length,
    attente:  rows.filter(r => r.statut === 'En attente').length,
    retard:   rows.filter(r => r.statut === 'En retard').length,
    caTotal:  rows.reduce((s, r) => s + calcTotal(r), 0),
  }), [rows]);

  // ── Filtered ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = rows;
    if (filterStatut !== 'Tous') data = data.filter(r => r.statut === filterStatut);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.numero.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q)
      );
    }
    return data;
  }, [rows, search, filterStatut]);

  const toast = (msg, severity = 'success') => setSnack({ open: true, msg, severity });

  // ── Form ───────────────────────────────────────────────────
  const openCreate = () => {
    const today = new Date().toISOString().slice(0, 10);
    const due   = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    setForm({ ...EMPTY_FORM, dateEmission: today, dateEcheance: due });
    setFormErrors({});
    setDrawerOpen(true);
  };

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addItem    = () => setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));
  const removeItem = (idx) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const setItem    = (idx, key, val) => setForm(f => ({
    ...f,
    items: f.items.map((it, i) => i === idx ? { ...it, [key]: key === 'description' ? val : Number(val) } : it),
  }));

  const subtotal = form.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const taxAmt   = subtotal * (form.tax / 100);
  const discAmt  = subtotal * (form.discount / 100);
  const totalAmt = subtotal + taxAmt - discAmt;

  const validate = () => {
    const e = {};
    if (!form.client)        e.client = 'Client requis';
    if (!form.dateEmission)  e.dateEmission = 'Date requise';
    if (!form.dateEcheance)  e.dateEcheance = 'Date requise';
    if (form.items.some(i => !i.description.trim())) e.items = 'Toutes les descriptions sont requises';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const num = `FAC-2026-00${idCounter}`;
    setRows(prev => [...prev, { id: idCounter++, numero: num, ...form }]);
    toast('Facture créée avec succès');
    setDrawerOpen(false);
  };

  const handleDelete = (id) => {
    setRows(prev => prev.filter(r => r.id !== id));
    toast('Facture supprimée', 'info');
  };

  // ── PDF download ───────────────────────────────────────────
  const downloadPDF = async (facture) => {
    setPreviewFacture(facture);
    setDownloading(true);
    // Give DOM time to render the hidden template
    await new Promise(r => setTimeout(r, 400));
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`${facture.numero}.pdf`);
      toast(`${facture.numero}.pdf téléchargé`);
    } catch (err) {
      toast('Erreur lors du téléchargement', 'error');
    }
    setDownloading(false);
    setPreviewFacture(null);
  };

  // ── Columns ────────────────────────────────────────────────
  const columns = [
    {
      field: 'numero', headerName: 'Numéro', width: 150,
      renderCell: ({ value }) => (
        <Typography sx={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 700, color: '#3b82f6' }}>{value}</Typography>
      ),
    },
    {
      field: 'client', headerName: 'Client', flex: 1.2, minWidth: 180,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: avatarColor(row.client), fontSize: '0.68rem', fontWeight: 700 }}>
            {row.client.slice(0, 2).toUpperCase()}
          </Avatar>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>{row.client}</Typography>
        </Box>
      ),
    },
    {
      field: 'dateEmission', headerName: 'Émission', width: 120,
      renderCell: ({ value }) => <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>{value}</Typography>,
    },
    {
      field: 'dateEcheance', headerName: 'Échéance', width: 120,
      renderCell: ({ value }) => <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>{value}</Typography>,
    },
    {
      field: 'statut', headerName: 'Statut', width: 130,
      renderCell: ({ value }) => {
        const s = STATUT_STYLE[value] || STATUT_STYLE['Brouillon'];
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, px: 1.2, py: 0.4, borderRadius: 10, bgcolor: s.bg }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: s.dot }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: s.color }}>{value}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'total', headerName: 'Total', width: 140,
      valueGetter: (params) => {
        if (!params || !params.row) return 0; // Null guard
        return calcTotal(params.row);
      },
      renderCell: ({ value }) => (
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
          {(value || 0).toFixed(2)} DH
        </Typography>
      ),
    },
    {
      field: 'actions', headerName: '', width: 120, sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Aperçu">
            <IconButton size="small" onClick={() => setPreviewFacture(row)}
              sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#eff6ff' } }}>
              <VisibilityRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Télécharger PDF">
            <IconButton size="small" onClick={() => downloadPDF(row)} disabled={downloading}
              sx={{ color: '#10b981', '&:hover': { bgcolor: '#d1fae5' } }}>
              <DownloadRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton size="small" onClick={() => handleDelete(row.id)}
              sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}>
              <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1600px', margin: '0 auto' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>Factures</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.4 }}>
              {rows.length} factures · CA total {stats.caTotal.toFixed(0)} DH
            </Typography>
          </Box>
          <Button startIcon={<AddRoundedIcon />} onClick={openCreate} variant="contained"
            sx={{ bgcolor: '#0f172a', color: 'white', fontWeight: 700, borderRadius: '10px', px: 3, py: 1.2, textTransform: 'none', fontSize: '0.85rem', boxShadow: 'none', '&:hover': { bgcolor: '#1e293b', boxShadow: 'none' } }}>
            Nouvelle facture
          </Button>
        </Box>

        {/* Stat cards */}
        <Box sx={{ display: 'flex', gap: 2.5, mb: 4, flexWrap: 'wrap' }}>
          <StatCard icon={<ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />} label="Total factures" value={stats.total}   color="#3b82f6" sub="dans le système" />
          <StatCard icon={<PaidRoundedIcon sx={{ fontSize: 18 }} />}         label="Payées"         value={stats.payees}  color="#10b981" sub={`${Math.round((stats.payees/(stats.total||1))*100)}% du total`} />
          <StatCard icon={<HourglassEmptyRoundedIcon sx={{ fontSize: 18 }} />} label="En attente"   value={stats.attente} color="#f59e0b" sub="en cours" />
          <StatCard icon={<WarningAmberRoundedIcon sx={{ fontSize: 18 }} />} label="En retard"       value={stats.retard}  color="#ef4444" sub="à relancer" />
        </Box>

        {/* Toolbar */}
        <Box sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 3, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Rechercher par numéro ou client…"
            value={search} onChange={e => setSearch(e.target.value)} size="small"
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> }}
            sx={{ flex: '1 1 260px', '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }}
          />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <FilterListRoundedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
            {['Tous', ...STATUTS].map(s => (
              <Chip key={s} label={s} size="small" onClick={() => setFilterStatut(s)}
                sx={{ fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer', bgcolor: filterStatut === s ? '#0f172a' : '#f1f5f9', color: filterStatut === s ? 'white' : '#64748b', border: 'none', '&:hover': { bgcolor: filterStatut === s ? '#1e293b' : '#e2e8f0' } }}
              />
            ))}
          </Box>
        </Box>

        {/* DataGrid */}
        <Box sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: 3, borderTopLeftRadius: 0, borderTopRightRadius: 0, overflow: 'hidden' }}>
          <DataGrid
            rows={filtered} columns={columns} autoHeight
            disableSelectionOnClick
            pageSize={10} rowsPerPageOptions={[5, 10, 25]}
            sx={{
              border: 'none', fontSize: '0.82rem',
              '& .MuiDataGrid-columnHeaders': { bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' } },
              '& .MuiDataGrid-row:hover': { bgcolor: '#f8fafc' },
              '& .MuiDataGrid-cell': { borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center' },
              '& .MuiDataGrid-footerContainer': { borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' },
            }}
          />
        </Box>
      </Box>

      {/* ════════════════════════════════════
          DRAWER — New invoice
      ════════════════════════════════════ */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 520 }, display: 'flex', flexDirection: 'column' } }}>

        {/* Drawer header */}
        <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>Nouvelle facture</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>Remplir les informations ci-dessous</Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: '#94a3b8' }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {/* Scrollable body */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Client & dates */}
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em', mb: 1.5 }}>
              Informations générales
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField select label="Client *" value={form.client} onChange={e => setField('client', e.target.value)}
                error={!!formErrors.client} helperText={formErrors.client}
                fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                {CLIENTS.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField select label="Ville" value={form.ville} onChange={e => setField('ville', e.target.value)}
                fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                {VILLES.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
              </TextField>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Date d'émission *" type="date" value={form.dateEmission}
                  onChange={e => setField('dateEmission', e.target.value)}
                  error={!!formErrors.dateEmission} helperText={formErrors.dateEmission}
                  fullWidth size="small" InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                <TextField label="Date d'échéance *" type="date" value={form.dateEcheance}
                  onChange={e => setField('dateEcheance', e.target.value)}
                  error={!!formErrors.dateEcheance} helperText={formErrors.dateEcheance}
                  fullWidth size="small" InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              </Box>
              <TextField select label="Statut" value={form.statut} onChange={e => setField('statut', e.target.value)}
                fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                {STATUTS.map(s => (
                  <MenuItem key={s} value={s}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: STATUT_STYLE[s].dot }} />
                      {s}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#f1f5f9' }} />

          {/* Items */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                Articles
              </Typography>
              <Button size="small" startIcon={<AddCircleOutlineRoundedIcon sx={{ fontSize: 15 }} />} onClick={addItem}
                sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: '#3b82f6' }}>
                Ajouter
              </Button>
            </Box>
            {formErrors.items && (
              <Typography sx={{ fontSize: '0.72rem', color: '#ef4444', mb: 1 }}>{formErrors.items}</Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {form.items.map((item, idx) => (
                <Box key={idx} sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>Article {idx + 1}</Typography>
                    {form.items.length > 1 && (
                      <IconButton size="small" onClick={() => removeItem(idx)} sx={{ color: '#ef4444', p: 0.3 }}>
                        <RemoveCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Box>
                  <TextField placeholder="Description" value={item.description}
                    onChange={e => setItem(idx, 'description', e.target.value)}
                    fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField label="Qté" type="number" value={item.qty}
                      onChange={e => setItem(idx, 'qty', e.target.value)}
                      size="small" inputProps={{ min: 1 }}
                      sx={{ width: 80, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }} />
                    <TextField label="Prix unitaire (DH)" type="number" value={item.unitPrice}
                      onChange={e => setItem(idx, 'unitPrice', e.target.value)}
                      size="small" fullWidth inputProps={{ min: 0 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }} />
                    <Box sx={{ minWidth: 80, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
                        {(item.qty * item.unitPrice).toFixed(2)} DH
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#f1f5f9' }} />

          {/* Tax / Discount */}
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em', mb: 1.5 }}>
              Taxes & remise
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="TVA (%)" type="number" value={form.tax}
                onChange={e => setField('tax', Number(e.target.value))}
                fullWidth size="small" inputProps={{ min: 0, max: 100 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField label="Remise (%)" type="number" value={form.discount}
                onChange={e => setField('discount', Number(e.target.value))}
                fullWidth size="small" inputProps={{ min: 0, max: 100 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
          </Box>

          {/* Live total preview */}
          <Box sx={{ bgcolor: '#0f172a', borderRadius: 2, p: 2 }}>
            {[
              { label: 'Sous-total', val: subtotal },
              { label: `TVA ${form.tax}%`, val: taxAmt },
              { label: `Remise ${form.discount}%`, val: -discAmt },
            ].map(({ label, val }) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8' }}>{label}</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: val < 0 ? '#ef4444' : '#94a3b8' }}>
                  {val < 0 ? '-' : ''}{Math.abs(val).toFixed(2)} DH
                </Typography>
              </Box>
            ))}
            <Divider sx={{ borderColor: '#1e293b', my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>Total TTC</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#10b981' }}>{totalAmt.toFixed(2)} DH</Typography>
            </Box>
          </Box>

          {/* Notes */}
          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em', mb: 1.5 }}>
              Notes (optionnel)
            </Typography>
            <TextField multiline rows={3} placeholder="Conditions de paiement, remarques…"
              value={form.notes} onChange={e => setField('notes', e.target.value)}
              fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
          </Box>
        </Box>

        {/* Drawer footer */}
        <Box sx={{ px: 3, py: 2.5, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 2, flexShrink: 0 }}>
          <Button fullWidth onClick={() => setDrawerOpen(false)} variant="outlined"
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' } }}>
            Annuler
          </Button>
          <Button fullWidth onClick={handleSave} variant="contained"
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, bgcolor: '#0f172a', boxShadow: 'none', '&:hover': { bgcolor: '#1e293b', boxShadow: 'none' } }}>
            Créer la facture
          </Button>
        </Box>
      </Drawer>

      {/* ════════════════════════════════════
          DIALOG — Invoice preview
      ════════════════════════════════════ */}
      <Dialog
        open={!!previewFacture && !downloading}
        onClose={() => setPreviewFacture(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        {/* Preview toolbar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 1.5, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
            Aperçu — {previewFacture?.numero}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<DownloadRoundedIcon />}
              onClick={() => { setPreviewFacture(null); downloadPDF(previewFacture); }}
              variant="contained" size="small"
              sx={{ bgcolor: '#10b981', boxShadow: 'none', textTransform: 'none', fontWeight: 700, borderRadius: '8px', '&:hover': { bgcolor: '#059669', boxShadow: 'none' } }}>
              Télécharger PDF
            </Button>
            <IconButton onClick={() => setPreviewFacture(null)} size="small" sx={{ color: '#94a3b8' }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Preview content */}
        <DialogContent sx={{ p: 0, bgcolor: '#e2e8f0', display: 'flex', justifyContent: 'center', py: 3 }}>
          <Box sx={{ transform: 'scale(0.78)', transformOrigin: 'top center', width: 794, flexShrink: 0 }}>
            <InvoicePDF facture={previewFacture} />
          </Box>
        </DialogContent>
      </Dialog>

      {/* ── Hidden off-screen PDF template for html2canvas ── */}
      <Box sx={{ position: 'fixed', top: 0, left: '-9999px', zIndex: -1 }}>
        <InvoicePDF ref={pdfRef} facture={previewFacture} />
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
