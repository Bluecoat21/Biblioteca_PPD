<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RecursoCategoria extends Pivot
{
    protected $table = 'recurso_categoria';

    protected $fillable = [
        'recurso_bibliografico_id',
        'categoria_id',
    ];

    public $timestamps = true;
}