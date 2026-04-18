import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

/**
 * InvoicePDF
 * Rendered off-screen (position:absolute, left:-9999px) and captured by html2canvas.
 * Keep styles inline / MUI-only — no Tailwind, no external fonts that might not load.
 */
const InvoicePDF = React.forwardRef(({ facture }, ref) => {
  if (!facture) return null;

  const subtotal = facture.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const taxAmt   = subtotal * (facture.tax / 100);
  const discAmt  = subtotal * (facture.discount / 100);
  const total    = subtotal + taxAmt - discAmt;

  const STATUS_COLOR = {
    Payée:      { bg: '#d1fae5', color: '#065f46' },
    'En attente': { bg: '#fef3c7', color: '#92400e' },
    'En retard':  { bg: '#fee2e2', color: '#991b1b' },
    Brouillon:  { bg: '#f1f5f9', color: '#475569' },
  };
  const sc = STATUS_COLOR[facture.statut] || STATUS_COLOR['Brouillon'];

  return (
    <Box
      ref={ref}
      sx={{
        width: 794,           // A4 at 96dpi
        minHeight: 1123,
        bgcolor: 'white',
        p: '48px 56px',
        fontFamily: 'Arial, sans-serif',
        color: '#1e293b',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
        <Box>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <img src="/logo invoice.jpg" alt="Logo" style={{ height: '35px', marginRight: '10px' }} />
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', letterSpacing: '-.01em' }}>
              InvoiceFlow
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6 }}>
            123 Bd Mohammed V, Casablanca<br />
            Maroc · contact@invoiceflow.ma
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
            FACTURE
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>
            {facture.numero}
          </Typography>
          <Box sx={{
            display: 'inline-block', mt: 1.5, px: 1.5, py: 0.5,
            borderRadius: '6px', bgcolor: sc.bg,
          }}>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: sc.color }}>
              {facture.statut}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Meta row ── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 5 }}>
        {[
          { label: 'Client',       value: facture.client },
          { label: 'Date émission',value: facture.dateEmission },
          { label: 'Date échéance',value: facture.dateEcheance },
          { label: 'Ville',        value: facture.ville || '—' },
        ].map(({ label, value }) => (
          <Box key={label} sx={{
            flex: 1, bgcolor: '#f8fafc', borderRadius: '8px', p: '12px 14px',
            border: '1px solid #e2e8f0',
          }}>
            <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', mb: 0.4 }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── Items table ── */}
      <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', mb: 1.5 }}>Articles</Typography>
      <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', mb: 4 }}>
        {/* Head */}
        <Box sx={{ display: 'flex', bgcolor: '#f8fafc', px: 2, py: 1.2, borderBottom: '1px solid #e2e8f0' }}>
          {['Description','Qté','Prix unitaire','Total'].map((h, i) => (
            <Typography key={h} sx={{
              flex: i === 0 ? 3 : 1,
              fontSize: '0.7rem', fontWeight: 700, color: '#64748b',
              textTransform: 'uppercase', letterSpacing: '.05em',
              textAlign: i > 0 ? 'right' : 'left',
            }}>{h}</Typography>
          ))}
        </Box>
        {/* Rows */}
        {facture.items.map((item, idx) => (
          <Box key={idx} sx={{
            display: 'flex', px: 2, py: 1.4,
            borderBottom: idx < facture.items.length - 1 ? '1px solid #f1f5f9' : 'none',
            bgcolor: idx % 2 === 1 ? '#fafafa' : 'white',
          }}>
            <Typography sx={{ flex: 3, fontSize: '0.82rem', color: '#1e293b' }}>{item.description}</Typography>
            <Typography sx={{ flex: 1, fontSize: '0.82rem', color: '#64748b', textAlign: 'right' }}>{item.qty}</Typography>
            <Typography sx={{ flex: 1, fontSize: '0.82rem', color: '#64748b', textAlign: 'right' }}>{item.unitPrice.toFixed(2)} DH</Typography>
            <Typography sx={{ flex: 1, fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', textAlign: 'right' }}>
              {(item.qty * item.unitPrice).toFixed(2)} DH
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── Totals ── */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 5 }}>
        <Box sx={{ width: 260 }}>
          {[
            { label: 'Sous-total', value: subtotal, muted: true },
            { label: `TVA (${facture.tax}%)`, value: taxAmt, muted: true },
            { label: `Remise (${facture.discount}%)`, value: -discAmt, muted: true },
          ].map(({ label, value, muted }) => (
            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.6 }}>
              <Typography sx={{ fontSize: '0.82rem', color: muted ? '#64748b' : '#1e293b' }}>{label}</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: value < 0 ? '#ef4444' : '#64748b' }}>
                {value < 0 ? '-' : ''}{Math.abs(value).toFixed(2)} DH
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1, borderColor: '#e2e8f0' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.6 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem' }}>Total</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#10b981' }}>
              {total.toFixed(2)} DH
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Notes ── */}
      {facture.notes && (
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', mb: 1 }}>Notes</Typography>
          <Box sx={{ bgcolor: '#f8fafc', borderRadius: '8px', p: 2, border: '1px solid #e2e8f0' }}>
            <Typography sx={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.7 }}>
              {facture.notes}
            </Typography>
          </Box>
        </Box>
      )}

      {/* ── Footer ── */}
      <Box sx={{ position: 'absolute', bottom: 40, left: 56, right: 56, display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '0.68rem', color: '#cbd5e1' }}>Généré par InvoiceFlow</Typography>
        <Typography sx={{ fontSize: '0.68rem', color: '#cbd5e1' }}>{facture.numero}</Typography>
      </Box>
    </Box>
  );
});

InvoicePDF.displayName = 'InvoicePDF';
export default InvoicePDF;
