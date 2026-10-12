<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRecursoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Obtenemos el ID del recurso que se está actualizando desde la ruta
        $recursoId = $this->route('recurso')->id ?? $this->route('recurso');

        return [
            'titulo' => 'required|string|max:255',
            'isbn' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('recursos_bibliograficos', 'isbn')->ignore($recursoId),
            ],
            'issn' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('recursos_bibliograficos', 'issn')->ignore($recursoId),
            ],
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