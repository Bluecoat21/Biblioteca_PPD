<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    use HasFactory;

    protected $table = 'reservas';

    protected $fillable = [
        'recurso_bibliografico_id',
        'user_id',
        'fecha_reserva',
        'fecha_expiracion',
        'estado',
        'posicion_cola',
    ];

    // Recurso bibliográfico reservado
    public function recursoBibliografico()
    {
        return $this->belongsTo(RecursoBibliografico::class, 'recurso_bibliografico_id');
    }

    // Usuario que realiza la reserva
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}