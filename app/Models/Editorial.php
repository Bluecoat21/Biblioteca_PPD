<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Editorial extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'editoriales';

    protected $fillable = [
        'nombre',
        'pais',
        'sitio_web',
    ];

    public function recursosBibliograficos()
    {
        return $this->hasMany(RecursoBibliografico::class, 'editorial_id');
    }
}