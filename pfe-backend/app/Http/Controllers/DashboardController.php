<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Facture;
use App\Models\Paiement;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_revenue'  => Paiement::sum('montant'),
            'total_clients'  => Client::count(),
            'total_invoices' => Facture::count(),
            'pending_amount' => Facture::where('statut', 'en_attente')->sum('total'),
            'paid_count'     => Facture::where('statut', 'payée')->count(),
            'pending_count'  => Facture::where('statut', 'en_attente')->count(),
            'overdue_count'  => Facture::where('statut', 'en_retard')->count(),
        ]);
    }

    public function revenue()
    {
        $data = Paiement::where('date_paiement', '>=', now()->subMonths(6))
            ->selectRaw("DATE_FORMAT(date_paiement, '%Y-%m') as month, SUM(montant) as total")
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        return response()->json($data);
    }

    public function topClients()
    {
        $data = Client::withSum('factures as total_facture', 'total')
            ->orderByDesc('total_facture')
            ->limit(5)
            ->get();
        return response()->json($data);
    }

    public function recentInvoices()
    {
        return response()->json(
            Facture::with('client')->latest()->limit(5)->get()
        );
    }
}
