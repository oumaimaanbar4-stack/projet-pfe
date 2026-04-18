import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Button, Drawer, TextField, IconButton,
  InputAdornment, Chip, Avatar, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogActions, MenuItem,
  Divider, Snackbar, Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from '../components/Navbar';

import AddRoundedIcon                from '@mui/icons-material/AddRounded';
import SearchRoundedIcon             from '@mui/icons-material/SearchRounded';
import DeleteOutlineRoundedIcon      from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon               from '@mui/icons-material/EditRounded';
import CloseRoundedIcon              from '@mui/icons-material/CloseRounded';
import PeopleAltRoundedIcon          from '@mui/icons-material/PeopleAltRounded';
import TrendingUpRoundedIcon         from '@mui/icons-material/TrendingUpRounded';
import WarningAmberRoundedIcon       from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import FilterListRoundedIcon         from '@mui/icons-material/FilterListRounded';

// ── Seed data ────────────────────────────────────────────────
let idCounter = 7;
const SEED = [
  { id: 1, nom: 'OCP Group',         email: 'contact@ocp.ma',           tel: '+212 5 22 00 00 01', ville: 'Casablanca', statut: 'Actif',     ca: 12750, factures: 8, createdAt: '2025-01-10' },
  { id: 2, nom: 'Maroc Telecom',     email: 'info@iam.ma',              tel: '+212 5 37 71 00 00', ville: 'Rabat',      statut: 'Actif',     ca: 8400,  factures: 5, createdAt: '2025-02-14' },
  { id: 3, nom: 'Attijariwafa Bank', email: 'client@attijariwafa.ma',   tel: '+212 5 22 22 88 00', ville: 'Casablanca', statut: 'En retard', ca: 5200,  factures: 3, createdAt: '2025-03-01' },
  { id: 4, nom: 'BMCE Bank',         email: 'bmce@bmcebank.ma',         tel: '+212 5 22 20 04 00', ville: 'Casablanca', statut: 'Actif',     ca: 3900,  factures: 4, createdAt: '2025-03-22' },
  { id: 5, nom: 'Centrale Danone',   email: 'danone@centraledanone.ma', tel: '+212 5 22 67 00 00', ville: 'Salé',       statut: 'Inactif',  ca: 7100,  factures: 6, createdAt: '2025-04-05' },
  { id: 6, nom: 'Cosumar',           email: 'info@cosumar.co.ma',       tel: '+212 5 22 67 83 00', ville: 'Casablanca', statut: 'Actif',     ca: 4600,  factures: 2, createdAt: '2025-05-18' },
];

const VILLES  = ['Casablanca','Rabat','Salé','Marrakech','Fès','Tanger','Agadir','Meknès'];
const STATUTS = ['Actif','Inactif','En retard'];

const STATUT_STYLE = {
  'Actif':     { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  'Inactif':   { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
  'En retard': { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
};

const EMPTY_FORM = { nom: '', email: '', tel: '', ville: 'Casablanca', statut: 'Actif', ca: '', factures: '' };

const avatarColor = (name) => {
  const palette = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#ec4899'];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % palette.length;
  return palette[h];
};

const StatCard = ({ icon, label, value, color, sub }) => (
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
    <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{value}</Typography>
    {sub && <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', mt: 0.5 }}>{sub}</Typography>}
  </Box>
);

// ════════════════════════════════════════════════════════════
export default function Clients() {
  const [rows, setRows]                 = useState(SEED);
  const [search, setSearch]             = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]     = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const [snack, setSnack]               = useState({ open: false, msg: '', severity: 'success' });

  // ── Computed stats ─────────────────────────────────────────
  const stats = useMemo(() => ({
    total:   rows.length,
    actifs:  rows.filter(r => r.statut === 'Actif').length,
    retard:  rows.filter(r => r.statut === 'En retard').length,
    caTotal: rows.reduce((s, r) => s + (r.ca || 0), 0),
  }), [rows]);

  // ── Filtered rows ──────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = rows;
    if (filterStatut !== 'Tous') data = data.filter(r => r.statut === filterStatut);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(r =>
        r.nom.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.ville.toLowerCase().includes(q)
      );
    }
    return data;
  }, [rows, search, filterStatut]);

  // ── Helpers ────────────────────────────────────────────────
  const toast      = (msg, severity = 'success') => setSnack({ open: true, msg, severity });
  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setFormErrors({}); setDrawerOpen(true); };
  const openEdit   = (row) => {
    setEditTarget(row);
    setForm({ nom: row.nom, email: row.email, tel: row.tel, ville: row.ville, statut: row.statut, ca: row.ca, factures: row.factures });
    setFormErrors({});
    setDrawerOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.nom.trim())   e.nom   = 'Nom requis';
    if (!form.email.trim()) e.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    if (!form.tel.trim())   e.tel   = 'Téléphone requis';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editTarget) {
      setRows(prev => prev.map(r =>
        r.id === editTarget.id
          ? { ...r, ...form, ca: Number(form.ca), factures: Number(form.factures) }
          : r
      ));
      toast('Client modifié avec succès');
    } else {
      setRows(prev => [...prev, {
        id: idCounter++,
        ...form,
        ca: Number(form.ca) || 0,
        factures: Number(form.factures) || 0,
        createdAt: new Date().toISOString().slice(0, 10),
      }]);
      toast('Client créé avec succès');
    }
    setDrawerOpen(false);
  };

  const handleDelete = (id) => {
    setRows(prev => prev.filter(r => r.id !== id));
    setDeleteTarget(null);
    setSelectionModel([]);
    toast('Client supprimé', 'info');
  };

  const handleBulkDelete = () => {
    const count = selectionModel.length;
    setRows(prev => prev.filter(r => !selectionModel.includes(r.id)));
    setSelectionModel([]);
    toast(`${count} clients supprimés`, 'info');
  };

  // ── Columns ────────────────────────────────────────────────
  const columns = [
    {
      field: 'nom', headerName: 'Client', flex: 1.4, minWidth: 200,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor(row.nom), fontSize: '0.72rem', fontWeight: 700 }}>
            {row.nom.slice(0, 2).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>{row.nom}</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>{row.ville}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'email', headerName: 'Email', flex: 1.3, minWidth: 190,
      renderCell: ({ value }) => (
        <Typography sx={{ fontSize: '0.8rem', color: '#3b82f6' }}>{value}</Typography>
      ),
    },
    {
      field: 'tel', headerName: 'Téléphone', flex: 1, minWidth: 160,
      renderCell: ({ value }) => (
        <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>{value}</Typography>
      ),
    },
    {
      field: 'statut', headerName: 'Statut', width: 130,
      renderCell: ({ value }) => {
        const s = STATUT_STYLE[value] || STATUT_STYLE['Inactif'];
        return (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, px: 1.2, py: 0.4, borderRadius: 10, bgcolor: s.bg }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: s.dot }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: s.color }}>{value}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'ca', headerName: 'CA (DH)', width: 140,
      renderCell: ({ value }) => (
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
          {(value || 0).toLocaleString('fr-MA')} DH
        </Typography>
      ),
    },
    {
      field: 'factures', headerName: 'Factures', width: 100,
      renderCell: ({ value }) => (
        <Chip label={`${value} fact.`} size="small"
          sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 700, fontSize: '0.68rem', border: 'none' }} />
      ),
    },
    {
      field: 'createdAt', headerName: 'Ajouté le', width: 120,
      renderCell: ({ value }) => (
        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>{value}</Typography>
      ),
    },
    {
      field: 'actions', headerName: '', width: 100, sortable: false, filterable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Modifier">
            <IconButton size="small" onClick={() => openEdit(row)}
              sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#eff6ff' } }}>
              <EditRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton size="small" onClick={() => setDeleteTarget(row)}
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
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>Clients</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.4 }}>
              Gestion et suivi de vos {rows.length} clients
            </Typography>
          </Box>
          <Button
            startIcon={<AddRoundedIcon />}
            onClick={openCreate}
            variant="contained"
            sx={{
              bgcolor: '#0f172a', color: 'white', fontWeight: 700, borderRadius: '10px',
              px: 3, py: 1.2, textTransform: 'none', fontSize: '0.85rem',
              boxShadow: 'none', '&:hover': { bgcolor: '#1e293b', boxShadow: 'none' },
            }}
          >
            Nouveau client
          </Button>
        </Box>

        {/* Stat cards */}
        <Box sx={{ display: 'flex', gap: 2.5, mb: 4, flexWrap: 'wrap' }}>
          <StatCard icon={<PeopleAltRoundedIcon sx={{ fontSize: 18 }} />}
            label="Total clients" value={stats.total} color="#3b82f6" sub="dans la base" />
          <StatCard icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 18 }} />}
            label="Clients actifs" value={stats.actifs} color="#10b981"
            sub={`${Math.round((stats.actifs / (stats.total || 1)) * 100)}% du total`} />
          <StatCard icon={<WarningAmberRoundedIcon sx={{ fontSize: 18 }} />}
            label="En retard" value={stats.retard} color="#ef4444" sub="paiements en attente" />
          <StatCard icon={<TrendingUpRoundedIcon sx={{ fontSize: 18 }} />}
            label="CA total" value={`${stats.caTotal.toLocaleString('fr-MA')} DH`}
            color="#8b5cf6" sub="tous clients confondus" />
        </Box>

        {/* Toolbar */}
        <Box sx={{
          bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 3,
          borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
          p: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
        }}>
          <TextField
            placeholder="Rechercher un client…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: '1 1 220px', '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.85rem' } }}
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <FilterListRoundedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
            {['Tous', ...STATUTS].map(s => (
              <Chip key={s} label={s} size="small" onClick={() => setFilterStatut(s)}
                sx={{
                  fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer',
                  bgcolor: filterStatut === s ? '#0f172a' : '#f1f5f9',
                  color: filterStatut === s ? 'white' : '#64748b',
                  border: 'none',
                  '&:hover': { bgcolor: filterStatut === s ? '#1e293b' : '#e2e8f0' },
                }}
              />
            ))}
          </Box>

          {selectionModel.length > 0 && (
            <Button startIcon={<DeleteOutlineRoundedIcon />} onClick={handleBulkDelete} size="small"
              sx={{
                ml: 'auto', color: '#ef4444', fontWeight: 700, textTransform: 'none', fontSize: '0.8rem',
                border: '1px solid #fee2e2', bgcolor: '#fff5f5', borderRadius: '8px', px: 2,
                '&:hover': { bgcolor: '#fee2e2' },
              }}>
              Supprimer ({selectionModel.length})
            </Button>
          )}
        </Box>

        {/* ── DataGrid — v5 API only ── */}
        <Box sx={{
          bgcolor: 'white', border: '1px solid #e2e8f0', borderTop: 'none',
          borderRadius: 3, borderTopLeftRadius: 0, borderTopRightRadius: 0, overflow: 'hidden',
        }}>
          <DataGrid
            rows={filtered}
            columns={columns}
            autoHeight
            checkboxSelection
            disableSelectionOnClick
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
            selectionModel={selectionModel}
            onSelectionModelChange={(newModel) => setSelectionModel(newModel)}
            sx={{
              border: 'none',
              fontSize: '0.82rem',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 700, fontSize: '0.72rem', color: '#64748b',
                  textTransform: 'uppercase', letterSpacing: '.05em',
                },
              },
              '& .MuiDataGrid-row:hover': { bgcolor: '#f8fafc' },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid #e2e8f0',
                bgcolor: '#f8fafc',
              },
              '& .MuiCheckbox-root': { color: '#94a3b8' },
              '& .MuiCheckbox-root.Mui-checked': { color: '#10b981' },
            }}
          />
        </Box>
      </Box>

      {/* ── Drawer: Create / Edit ── */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 440 }, p: 0 } }}>

        {/* Drawer header */}
        <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>
              {editTarget ? 'Modifier le client' : 'Nouveau client'}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {editTarget ? `Édition de ${editTarget.nom}` : 'Remplir les informations ci-dessous'}
            </Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: '#94a3b8' }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {/* Live avatar preview */}
        {form.nom.trim() && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, pt: 3 }}>
            <Avatar sx={{ width: 44, height: 44, bgcolor: avatarColor(form.nom), fontWeight: 700 }}>
              {form.nom.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{form.nom}</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>{form.ville}</Typography>
            </Box>
          </Box>
        )}

        {/* Drawer form */}
        <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5, overflowY: 'auto', flex: 1 }}>

          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em', mb: 1.5 }}>
              Informations générales
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Nom de l'entreprise *" value={form.nom}
                onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                error={!!formErrors.nom} helperText={formErrors.nom}
                fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField label="Email *" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                error={!!formErrors.email} helperText={formErrors.email}
                fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField label="Téléphone *" value={form.tel}
                onChange={e => setForm(f => ({ ...f, tel: e.target.value }))}
                error={!!formErrors.tel} helperText={formErrors.tel}
                fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#f1f5f9' }} />

          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em', mb: 1.5 }}>
              Localisation & statut
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField select label="Ville" value={form.ville}
                onChange={e => setForm(f => ({ ...f, ville: e.target.value }))}
                fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                {VILLES.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
              </TextField>
              <TextField select label="Statut" value={form.statut}
                onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}
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

          <Box>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em', mb: 1.5 }}>
              Données commerciales
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="CA (DH)" type="number" value={form.ca}
                onChange={e => setForm(f => ({ ...f, ca: e.target.value }))}
                fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
              <TextField label="Nb. factures" type="number" value={form.factures}
                onChange={e => setForm(f => ({ ...f, factures: e.target.value }))}
                fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
            </Box>
          </Box>
        </Box>

        {/* Drawer footer */}
        <Box sx={{ px: 3, py: 2.5, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 2 }}>
          <Button fullWidth onClick={() => setDrawerOpen(false)} variant="outlined"
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, borderColor: '#e2e8f0', color: '#64748b',
              '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' } }}>
            Annuler
          </Button>
          <Button fullWidth onClick={handleSave} variant="contained"
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, bgcolor: '#0f172a', boxShadow: 'none',
              '&:hover': { bgcolor: '#1e293b', boxShadow: 'none' } }}>
            {editTarget ? 'Enregistrer' : 'Créer le client'}
          </Button>
        </Box>
      </Drawer>

      {/* ── Dialog: Confirm delete ── */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: 3, p: 1, maxWidth: 400, width: '100%' } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b', pb: 1 }}>
          Supprimer ce client ?
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: '#fff5f5', borderRadius: 2 }}>
            <WarningAmberRoundedIcon sx={{ color: '#ef4444', fontSize: 22, mt: 0.2 }} />
            <Typography sx={{ fontSize: '0.83rem', color: '#7f1d1d' }}>
              <strong>{deleteTarget?.nom}</strong> sera supprimé définitivement.
              Ses {deleteTarget?.factures} facture(s) associées resteront dans le système.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} variant="outlined"
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, borderColor: '#e2e8f0', color: '#64748b' }}>
            Annuler
          </Button>
          <Button onClick={() => handleDelete(deleteTarget.id)} variant="contained"
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, bgcolor: '#ef4444', boxShadow: 'none',
              '&:hover': { bgcolor: '#dc2626', boxShadow: 'none' } }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Toast ── */}
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
