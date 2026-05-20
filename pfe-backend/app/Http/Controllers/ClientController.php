<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return response()->json(Client::withCount('factures')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'        => 'required|string',
            'societe'    => 'nullable|string',
            'email'      => 'required|email|unique:clients',
            'telephone'  => 'nullable|string',
            'adresse'    => 'nullable|string',
            'numero_tva' => 'nullable|string',
            'notes'      => 'nullable|string',
        ]);
        return response()->json(Client::create($data), 201);
    }

    public function show(Client $client)
    {
        return response()->json($client->load('factures'));
    }

    public function update(Request $request, Client $client)
    {
        $data = $request->validate([
            'nom'        => 'sometimes|string',
            'societe'    => 'nullable|string',
            'email'      => 'sometimes|email|unique:clients,email,' . $client->id,
            'telephone'  => 'nullable|string',
            'adresse'    => 'nullable|string',
            'numero_tva' => 'nullable|string',
            'notes'      => 'nullable|string',
        ]);
        $client->update($data);
        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(['message' => 'Client supprimé']);
    }
}
