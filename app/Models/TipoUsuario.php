<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoUsuario extends Model
{
    protected $table = 'tipos_usuario';

    protected $fillable = [
        'nombre',
        'max_prestamos',
        'dias_prestamo_default',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'tipo_usuario_id');
    }
}