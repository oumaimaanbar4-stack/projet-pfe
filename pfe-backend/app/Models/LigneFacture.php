<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LigneFacture extends Model
{
    protected $fillable = [
        'facture_id',
        'description',
        'quantite',
        'prix_unitaire',
        'total_ligne'
    ];

    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }
}
