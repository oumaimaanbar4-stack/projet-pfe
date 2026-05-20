<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use Illuminate\Http\Request;

class FactureController extends Controller
{
    public function index()
    {
        return response()->json(Facture::with('client', 'lignes', 'paiements')->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id'              => 'required|exists:clients,id',
            'date_emission'          => 'required|date',
            'date_echeance'          => 'required|date',
            'statut'                 => 'nullable|string',
            'taxe'                   => 'nullable|numeric|min:0',
            'remise'                 => 'nullable|numeric|min:0',
            'notes'                  => 'nullable|string',
            'lignes'                 => 'required|array|min:1',
            'lignes.*.description'   => 'required|string',
            'lignes.*.quantite'      => 'required|integer|min:1',
            'lignes.*.prix_unitaire' => 'required|numeric|min:0',
        ]);

        $subtotal = collect($data['lignes'])->sum(fn($l) => $l['quantite'] * $l['prix_unitaire']);
        $taxe     = $data['taxe'] ?? 0;
        $remise   = $data['remise'] ?? 0;
        $total    = $subtotal + ($subtotal * $taxe / 100) - $remise;
        $numero   = 'FAC-' . date('Y') . '-' . str_pad(Facture::count() + 1, 4, '0', STR_PAD_LEFT);

        $facture = Facture::create([
            'client_id'      => $data['client_id'],
            'date_emission'  => $data['date_emission'],
            'date_echeance'  => $data['date_echeance'],
            'numero_facture' => $numero,
            'statut'         => $data['statut'] ?? 'en_attente',
            'taxe'           => $taxe,
            'remise'         => $remise,
            'total'          => $total,
            'notes'          => $data['notes'] ?? null,
        ]);

        foreach ($data['lignes'] as $ligne) {
            $facture->lignes()->create([
                'description'   => $ligne['description'],
                'quantite'      => $ligne['quantite'],
                'prix_unitaire' => $ligne['prix_unitaire'],
                'total_ligne'   => $ligne['quantite'] * $ligne['prix_unitaire'],
            ]);
        }

        return response()->json($facture->load('client', 'lignes'), 201);
    }

    public function show(Facture $facture)
    {
        return response()->json($facture->load('client', 'lignes', 'paiements'));
    }

    public function update(Request $request, Facture $facture)
    {
        $data = $request->validate([
            'statut'        => 'sometimes|in:payée,payee,en_attente,en_retard',
            'date_echeance' => 'sometimes|date',
            'notes'         => 'nullable|string',
        ]);
        $facture->update($data);
        return response()->json($facture);
    }

    public function destroy(Facture $facture)
    {
        $facture->delete();
        return response()->json(['message' => 'Facture supprimée']);
    }
}
