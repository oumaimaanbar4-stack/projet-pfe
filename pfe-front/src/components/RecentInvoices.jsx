import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import api from '../services/api';

const statusStyle = {
  'payée':      { bgcolor: '#d1fae5', color: '#065f46', label: 'Payée' },
  'en_attente': { bgcolor: '#fef3c7', color: '#92400e', label: 'En attente' },
  'en_retard':  { bgcolor: '#fee2e2', color: '#991b1b', label: 'En retard' },
};

const RecentInvoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    api.get('/dashboard/recent-invoices').then(res => setInvoices(res.data));
  }, []);

  return (
    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, border: '1px solid #e2e8f0', flex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>
            Factures récentes
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>5 dernières transactions</Typography>
        </Box>
        <Chip label="Voir tout" size="small" sx={{ fontSize: '0.7rem', bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 700, cursor: 'pointer' }} />
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            {['Numéro', 'Client', 'Montant', 'Statut'].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid #f1f5f9', pb: 1 }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((inv) => {
            const s = statusStyle[inv.statut] || statusStyle['en_attente'];
            return (
              <TableRow key={inv.id} sx={{ '&:hover': { bgcolor: '#f8fafc' }, cursor: 'pointer', '& td': { borderBottom: '1px solid #f8fafc' } }}>
                <TableCell sx={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>{inv.numero_facture}</TableCell>
                <TableCell sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b' }}>{inv.client?.nom}</TableCell>
                <TableCell sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>{Number(inv.total).toLocaleString('fr-MA')} DH</TableCell>
                <TableCell>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, px: 1.2, py: 0.3, borderRadius: 10, bgcolor: s.bgcolor }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: s.color }} />
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: s.color }}>{s.label}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

export default RecentInvoices;