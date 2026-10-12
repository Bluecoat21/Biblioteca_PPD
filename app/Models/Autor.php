<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Autor extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'autores';

    protected $fillable = [
        'nombres',
        'apellidos',
        'nacionalidad',
        'biografia',
        'fecha_nacimiento',
    ];

    public function recursos()
    {
        return $this->belongsToMany(RecursoBibliografico::class, 'recurso_autor', 'autor_id', 'recurso_bibliografico_id')
                    ->withPivot('orden')
                    ->withTimestamps();
    }
}