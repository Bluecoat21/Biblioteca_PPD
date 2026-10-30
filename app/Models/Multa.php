<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $prestamo_id
 * @property float $monto
 * @property string $motivo
 * @property int|null $dias_atraso
 * @property string $estado
 * @property \Illuminate\Support\Carbon $fecha_generacion
 * @property \Illuminate\Support\Carbon|null $fecha_pago
 * @property string|null $observaciones
 */
class Multa extends Model
{
    protected $table = 'multas';

    protected $fillable = [
        'user_id',
        'prestamo_id',
        'monto',
        'motivo',
        'dias_atraso',
        'estado',
        'fecha_generacion',
        'fecha_pago',
        'observaciones',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha_generacion' => 'datetime',
        'fecha_pago' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function prestamo()
    {
         return $this->belongsTo(Prestamo::class, 'prestamo_id');
    }
}