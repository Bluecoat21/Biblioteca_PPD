<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

#[Fillable([
    'name',
    'email',
    'password',
    'documento_identidad',
    'codigo_estudiante',
    'codigo_acceso_web',    // <-- OBLIGATORIO: Permite guardar el código web
    'cuenta_web_activa',    // <-- OBLIGATORIO: Permite guardar el estado de activación web
    'tipo_usuario_id',
    'telefono',
    'estado',
    'fecha_suspension_hasta',
])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable, HasRoles, SoftDeletes;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'fecha_suspension_hasta' => 'date',
            'cuenta_web_activa' => 'boolean',
        ];
    }

    public function tipoUsuario()
    {
        return $this->belongsTo(TipoUsuario::class, 'tipo_usuario_id');
    }

    public function multas()
    {
        return $this->hasMany(Multa::class, 'user_id');
    }

    public function suspensiones()
    {
        return $this->hasMany(Suspension::class, 'user_id');
    }

    public function puedePrestar(): bool
    {
        return $this->estado === 'activo';
    }

    public function prestamos()
    {
        return $this->hasMany(Prestamo::class, 'user_id');
    }
}