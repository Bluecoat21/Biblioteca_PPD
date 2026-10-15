<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prestamo extends Model
{
    use HasFactory;

    protected $table = 'prestamos';

    protected $fillable = [
        'ejemplar_id',
        'user_id',
        'bibliotecario_id',
        'fecha_prestamo',
        'fecha_devolucion_esperada',
        'fecha_devolucion_real',
        'estado',
        'renovaciones',
    ];

    // Relación con el ejemplar prestado (apunta a la tabla 'ejemplars')
    public function ejemplar()
    {
        return $this->belongsTo(Ejemplar::class, 'ejemplar_id');
    }

    // Usuario que solicita el préstamo
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Bibliotecario que registró la operación
    public function bibliotecario()
    {
        return $this->belongsTo(User::class, 'bibliotecario_id');
    }
}