<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovimientoEjemplar extends Model
{
    use HasFactory;

    protected $table = 'movimientos_ejemplar';
    public $timestamps = false; // Solo tiene created_at
    protected $fillable = ['ejemplar_id', 'estado_anterior', 'estado_nuevo', 'motivo', 'user_id'];

    public function ejemplar()
    {
        return $this->belongsTo(Ejemplar::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}