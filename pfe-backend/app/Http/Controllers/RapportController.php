<?php

namespace App\Http\Controllers;

use App\Models\Rapport;
use Illuminate\Http\Request;

class RapportController extends Controller
{
    public function index()
    {
        return response()->json(Rapport::with('user')->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string',
        ]);

        $rapport = Rapport::create([
            'user_id'         => $request->user()->id,
            'type'            => $data['type'],
            'date_generation' => now()->toDateString(),
        ]);

        return response()->json($rapport, 201);
    }
}
