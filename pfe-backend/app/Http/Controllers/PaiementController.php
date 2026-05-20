<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\Facture;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'facture_id'       => 'required|exists:factures,id',
            'montant'          => 'required|numeric|min:0',
            'date_paiement'    => 'required|date',
            'methode_paiement' => 'required|string',
        ]);

        $paiement = Paiement::create($data);

        // Auto-update facture status to payée
        $facture       = Facture::find($data['facture_id']);
        $totalPaid     = $facture->paiements()->sum('montant');
        if ($totalPaid >= $facture->total) {
            $facture->update(['statut' => 'payée']);
        }

        return response()->json($paiement, 201);
    }

    public function index(Request $request)
    {
        return response()->json(
            Paiement::with('facture.client')->latest()->get()
        );
    }
}
