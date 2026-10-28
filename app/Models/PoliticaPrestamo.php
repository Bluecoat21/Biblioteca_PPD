<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PoliticaPrestamo extends Model
{
    use HasFactory;

    // Nombre exacto de la tabla según tu diagrama ER
    protected $table = 'politicas_prestamo';

    protected $fillable = [
        'tipo_usuario_id',
        'tipo_recurso',
        'dias_prestamo',
        'permite_renovacion',
        'max_renovaciones',
    ];

    protected $casts = [
        'permite_renovacion' => 'boolean',
        'dias_prestamo' => 'integer',
        'max_renovaciones' => 'integer',
    ];

    /**
     * Relación con el Tipo de Usuario
     */
    public function tipoUsuario()
    {
        return $this->belongsTo(TipoUsuario::class, 'tipo_usuario_id');
    }
}