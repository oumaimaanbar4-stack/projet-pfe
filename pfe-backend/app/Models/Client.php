<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'nom',
        'societe',
        'email',
        'telephone',
        'adresse',
        'numero_tva',
        'notes'
    ];

    public function factures()
    {
        return $this->hasMany(Facture::class);
    }
}
