import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Chip,
} from '@mui/material';

const invoices = [
  { id: '#F-2481', client: 'Maroc Telecom',   amount: '8 400 DH',  status: 'Payée' },
  { id: '#F-2480', client: 'OCP Group',        amount: '12 750 DH', status: 'En attente' },
  { id: '#F-2479', client: 'Attijariwafa',     amount: '5 200 DH',  status: 'En retard' },
  { id: '#F-2478', client: 'BMCE Bank',        amount: '3 900 DH',  status: 'Payée' },
  { id: '#F-2477', client: 'Centrale Danone',  amount: '7 100 DH',  status: 'En attente' },
];

const statusStyle = {
  'Payée':      { bgcolor: '#d1fae5', color: '#065f46' },
  'En attente': { bgcolor: '#fef3c7', color: '#92400e' },
  'En retard':  { bgcolor: '#fee2e2', color: '#991b1b' },
};

const RecentInvoices = () => (
  <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, border: '1px solid #e2e8f0', flex: 1 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>
          Factures récentes
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>5 dernières transactions</Typography>
      </Box>
      <Chip
        label="Voir tout"
        size="small"
        sx={{ fontSize: '0.7rem', bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
      />
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
        {invoices.map((inv) => (
          <TableRow
            key={inv.id}
            sx={{ '&:hover': { bgcolor: '#f8fafc' }, cursor: 'pointer', '& td': { borderBottom: '1px solid #f8fafc' } }}
          >
            <TableCell sx={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>{inv.id}</TableCell>
            <TableCell sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b' }}>{inv.client}</TableCell>
            <TableCell sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>{inv.amount}</TableCell>
            <TableCell>
              <Box
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.6,
                  px: 1.2, py: 0.3, borderRadius: 10,
                  bgcolor: statusStyle[inv.status].bgcolor,
                }}
              >
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: statusStyle[inv.status].color }} />
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: statusStyle[inv.status].color }}>
                  {inv.status}
                </Typography>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);

export default RecentInvoices;
