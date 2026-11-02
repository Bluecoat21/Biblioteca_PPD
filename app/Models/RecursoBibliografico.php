<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class RecursoBibliografico extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    protected $table = 'recursos_bibliograficos';

    protected $fillable = [
        'titulo',
        'isbn',
        'issn',
        'anio_publicacion',
        'idioma',
        'numero_paginas',
        'sinopsis',
        'tipo',
        'editorial_id',
        'es_digital',       // <--- Añadido
        'archivo_url',      // <--- Añadido
        'permite_descarga',
        'portada_url', // <--- Añadido
    ];

    public function editorial()
    {
        return $this->belongsTo(Editorial::class, 'editorial_id');
    }

    public function autores()
    {
        return $this->belongsToMany(Autor::class, 'recurso_autor', 'recurso_bibliografico_id', 'autor_id')
                    ->withPivot('orden'); // Sin withTimestamps porque la tabla no los tiene
    }

    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'recurso_categoria', 'recurso_bibliografico_id', 'categoria_id');
        // Quitamos withTimestamps() ya que recurso_categoria no tiene esas columnas
    }

    public function ejemplares()
    {
        return $this->hasMany(Ejemplar::class, 'recurso_bibliografico_id');
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'recurso_bibliografico_id');
    }
}