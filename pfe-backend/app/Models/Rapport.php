<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rapport extends Model
{
    protected $fillable = ['user_id', 'type', 'date_generation'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
