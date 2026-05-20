<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $fillable = [
        'facture_id',
        'montant',
        'date_paiement',
        'methode_paiement'
    ];

    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }
}
