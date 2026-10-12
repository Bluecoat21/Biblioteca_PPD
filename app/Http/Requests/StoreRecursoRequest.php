<?php

namespace App\Http\Requests; // O App\Http\Requests según tu estructura

use Illuminate\Foundation\Http\FormRequest;

class StoreRecursoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titulo' => 'required|string|max:255',
            'isbn' => 'nullable|string|unique:recursos_bibliograficos,isbn|max:20',
            'issn' => 'nullable|string|unique:recursos_bibliograficos,issn|max:20',
            'anio_publicacion' => 'nullable|integer|digits:4',
            'idioma' => 'nullable|string|max:50',
            'numero_paginas' => 'nullable|integer|min:1',
            'sinopsis' => 'nullable|string',
            'tipo' => 'required|in:libro,revista,tesis,digital',
            'editorial_id' => 'required|exists:editoriales,id',
            'autores' => 'required|array|min:1',
            'autores.*' => 'exists:autores,id',
            'categorias' => 'required|array|min:1',
            'categorias.*' => 'exists:categorias,id',
        ];
    }
}