<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    protected $fillable = [
        'numero_facture',
        'client_id',
        'date_emission',
        'date_echeance',
        'statut',
        'taxe',
        'remise',
        'total',
        'notes',
        'piece_jointe'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function lignes()
    {
        return $this->hasMany(LigneFacture::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
}
