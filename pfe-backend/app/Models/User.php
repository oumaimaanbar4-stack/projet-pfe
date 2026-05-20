<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['nom', 'email', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];

    public function clients()
    {
        return $this->hasMany(Client::class);
    }

    public function rapports()
    {
        return $this->hasMany(Rapport::class);
    }
}
