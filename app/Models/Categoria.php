<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Categoria extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'categorias';

    protected $fillable = [
        'nombre',
        'descripcion',
        'categoria_padre_id',
    ];

    // Relación recursiva para subcategorías
    public function categoriaPadre()
    {
        return $this->belongsTo(Categoria::class, 'categoria_padre_id');
    }

    public function subcategorias()
    {
        return $this->hasMany(Categoria::class, 'categoria_padre_id');
    }

    public function recursos()
    {
        return $this->belongsToMany(RecursoBibliografico::class, 'recurso_categoria', 'categoria_id', 'recurso_bibliografico_id')
                    ->withTimestamps();
    }
}