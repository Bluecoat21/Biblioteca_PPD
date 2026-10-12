<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ejemplar extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ejemplares';

    protected $fillable = [
        'recurso_bibliografico_id',
        'codigo_barras',
        'signatura_topografica',
        'estado',
        'tipo_adquisicion',
        'ubicacion_id',
        'fecha_adquisicion',
        'valor_adquisicion',
        'observaciones',
    ];

    public function recurso()
    {
        return $this->belongsTo(RecursoBibliografico::class, 'recurso_bibliografico_id');
    }
        public function ubicacion()
    {
    //    return $this->belongsTo(Ubicacion::class, 'ubicacion_id');
    }
        public function prestamos()
    {
     //   return $this->hasMany(Prestamo::class, 'ejemplar_id');
    }

    public function movimientos()
    {
    //    return $this->hasMany(MovimientoEjemplar::class, 'ejemplar_id');
    }
}