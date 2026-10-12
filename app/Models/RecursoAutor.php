<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RecursoAutor extends Pivot
{
    protected $table = 'recurso_autor';

    protected $fillable = [
        'recurso_bibliografico_id',
        'autor_id',
        'orden',
    ];

    public $timestamps = true;
}